import { validarToken } from '../config/auth.js';

export function verificarToken(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Autenticação necessária.' });
  }

  const dados = validarToken(token);
  if (!dados) {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada. Entre novamente.' });
  }

  req.admin = dados;
  next();
}