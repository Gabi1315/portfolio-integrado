import crypto from 'node:crypto';

const DURACAO_TOKEN_SEGUNDOS = 8 * 60 * 60; 

function lerConfig() {
  const { ADMIN_USER, ADMIN_PASSWORD_HASH, JWT_SECRET } = process.env;
  const ausentes = [];
  if (!ADMIN_USER) ausentes.push('ADMIN_USER');
  if (!ADMIN_PASSWORD_HASH) ausentes.push('ADMIN_PASSWORD_HASH');
  if (!JWT_SECRET) ausentes.push('JWT_SECRET');
  if (ausentes.length) {
    throw new Error(`Configuração de autenticação incompleta. Defina: ${ausentes.join(', ')}.`);
  }
  if (JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres.');
  }
  return { usuario: ADMIN_USER, hashSenha: ADMIN_PASSWORD_HASH, segredo: JWT_SECRET };
}

export function validarConfigAuth() {
  const { hashSenha } = lerConfig();
  if (hashSenha.split('$').length !== 6 || !hashSenha.startsWith('scrypt$')) {
    throw new Error('ADMIN_PASSWORD_HASH inválido. Gere um com: npm run hash-senha');
  }
}


export function gerarHashSenha(senha) {
  const N = 16384, r = 8, p = 1;
  const sal = crypto.randomBytes(16);
  const hash = crypto.scryptSync(senha, sal, 64, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${sal.toString('hex')}$${hash.toString('hex')}`;
}

function conferirSenha(senha, armazenado) {
  const [, N, r, p, salHex, hashHex] = armazenado.split('$');
  const esperado = Buffer.from(hashHex, 'hex');
  const calculado = crypto.scryptSync(senha, Buffer.from(salHex, 'hex'), esperado.length, {
    N: Number(N), r: Number(r), p: Number(p)
  });
  return crypto.timingSafeEqual(calculado, esperado);
}

function igualEmTempoConstante(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function credenciaisValidas(usuario, senha) {
  const { usuario: usuarioAdmin, hashSenha } = lerConfig();
  const usuarioOk = igualEmTempoConstante(usuario ?? '', usuarioAdmin);
  const senhaOk = conferirSenha(String(senha ?? ''), hashSenha);
  return usuarioOk && senhaOk;
}


const b64url = (dados) => Buffer.from(dados).toString('base64url');

function assinar(conteudo, segredo) {
  return crypto.createHmac('sha256', segredo).update(conteudo).digest('base64url');
}

export function gerarToken(usuario, agora = Math.floor(Date.now() / 1000)) {
  const { segredo } = lerConfig();
  const cabecalho = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const corpo = b64url(JSON.stringify({ sub: usuario, role: 'admin', iat: agora, exp: agora + DURACAO_TOKEN_SEGUNDOS }));
  return `${cabecalho}.${corpo}.${assinar(`${cabecalho}.${corpo}`, segredo)}`;
}

export function validarToken(token, agora = Math.floor(Date.now() / 1000)) {
  try {
    const { segredo } = lerConfig();
    const partes = String(token).split('.');
    if (partes.length !== 3) return null;
    const [cabecalho, corpo, assinatura] = partes;

    const cab = JSON.parse(Buffer.from(cabecalho, 'base64url').toString());
    if (cab.alg !== 'HS256') return null;

    const esperada = Buffer.from(assinar(`${cabecalho}.${corpo}`, segredo));
    const recebida = Buffer.from(assinatura);
    if (esperada.length !== recebida.length || !crypto.timingSafeEqual(esperada, recebida)) return null;

    const dados = JSON.parse(Buffer.from(corpo, 'base64url').toString());
    if (typeof dados.exp !== 'number' || dados.exp <= agora) return null;
    if (dados.role !== 'admin') return null;
    return dados;
  } catch {
    return null;
  }
}