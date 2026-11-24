const JANELA_MS = 15 * 60 * 1000;
const MAX_TENTATIVAS = 5;
const tentativas = new Map();

export function limitarLogin(req, res, next) {
  const agora = Date.now();
  const chave = req.ip;
  const registro = tentativas.get(chave);

  if (registro && agora - registro.inicio < JANELA_MS) {
    if (registro.total >= MAX_TENTATIVAS) {
      const minutos = Math.ceil((JANELA_MS - (agora - registro.inicio)) / 60000);
      return res.status(429).json({ erro: `Muitas tentativas. Tente novamente em ${minutos} minuto(s).` });
    }
  } else {
    tentativas.set(chave, { inicio: agora, total: 0 });
  }

  tentativas.get(chave).total += 1;
  next();
}

export function limparTentativas(ip) {
  tentativas.delete(ip);
}

setInterval(() => {
  const agora = Date.now();
  for (const [chave, registro] of tentativas) {
    if (agora - registro.inicio >= JANELA_MS) tentativas.delete(chave);
  }
}, JANELA_MS).unref();