import { credenciaisValidas, gerarToken } from '../config/auth.js';
import { limparTentativas } from '../middleware/limiteLogin.js';

export function loginAdmin(req, res) {
  const { usuario, senha } = req.body || {};

  if (typeof usuario !== 'string' || typeof senha !== 'string' || !usuario || !senha) {
    return res.status(400).json({ erro: 'Informe usuário e senha.' });
  }

  if (!credenciaisValidas(usuario, senha)) {
    return res.status(401).json({ erro: 'Usuário ou senha incorretos.' });
  }

  limparTentativas(req.ip);
  return res.json({ token: gerarToken(usuario) });
}