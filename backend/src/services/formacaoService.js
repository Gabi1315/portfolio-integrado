export async function listarFormacoes(Formacao) {
  return Formacao.findAll({ order: [['ordem', 'ASC']] });
}

export async function listarSecoes(Secao, formacaoId) {
  return Secao.findAll({
    where: { formacaoId },
    order: [['ordem', 'ASC']]
  });
}

export async function criarSecao(Secao, dados) {
  const { formacaoId, nome, tipo_periodo, ordem } = dados;

  if (!formacaoId || !nome || !ordem) {
    const erro = new Error('Formação, nome e ordem são obrigatórios');
    erro.status = 400;
    throw erro;
  }

  return Secao.create({ formacaoId, nome, tipo_periodo, ordem });
}
