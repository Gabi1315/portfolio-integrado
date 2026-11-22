export async function listarConteudos(Conteudo, formacaoId) {
  return Conteudo.findAll({
    where: { formacaoId, publicado: true },
    order: [['ordem', 'ASC']]
  });
}

export async function criarConteudo(Conteudo, dados) {
  const { formacaoId, secaoId, bimestre, titulo, texto, ordem, publicado } = dados;

  if (!formacaoId || !secaoId || !titulo || !texto || !ordem) {
    const erro = new Error('Formação, seção, título, texto e ordem são obrigatórios');
    erro.status = 400;
    throw erro;
  }

  return Conteudo.create({ formacaoId, secaoId, bimestre, titulo, texto, ordem, publicado: publicado ?? true });
}
