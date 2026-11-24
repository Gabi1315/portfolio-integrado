import crypto from 'node:crypto';
import { gerarHashSenha } from '../src/config/auth.js';

function lerSenhaOculta(pergunta) {
  return new Promise((resolve) => {
    process.stdout.write(pergunta);
    const stdin = process.stdin;
    let senha = '';
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', function aoDigitar(tecla) {
      for (const c of tecla) {
        if (c === '\r' || c === '\n' || c === '\u0004') {
          if (stdin.isTTY) stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', aoDigitar);
          process.stdout.write('\n');
          return resolve(senha);
        }
        if (c === '\u0003') process.exit(1);
        if (c === '\u007f' || c === '\b') senha = senha.slice(0, -1);
        else senha += c;
      }
    });
  });
}

const senha = await lerSenhaOculta('Nova senha do administrador (mín. 10 caracteres): ');
if (senha.length < 10) {
  console.error('Senha curta demais. Use pelo menos 10 caracteres.');
  process.exit(1);
}
const confirmacao = await lerSenhaOculta('Repita a senha: ');
if (senha !== confirmacao) {
  console.error('As senhas não conferem.');
  process.exit(1);
}

console.log('\nADMIN_PASSWORD_HASH=' + gerarHashSenha(senha));
console.log('\nJWT_SECRET=' + crypto.randomBytes(48).toString('hex'));
console.log('\nCopie as linhas acima para o .env.');