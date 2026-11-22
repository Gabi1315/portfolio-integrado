export async function buscarPerfil(Perfil) {
  return Perfil.findOne();
}

export async function salvarPerfil(Perfil, dados) {
  const { nome, turma, curso, sobre_mim, foto } = dados;

  if (!nome) {
    const erro = new Error('O nome é obrigatório');
    erro.status = 400;
    throw erro;
  }

  const perfilExistente = await Perfil.findOne();

  if (perfilExistente) {
    await perfilExistente.update({ nome, turma, curso, sobre_mim, foto });
    return perfilExistente;
  }

  return Perfil.create({ nome, turma, curso, sobre_mim, foto });
}
