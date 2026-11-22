
export async function listarProjetos(Projeto, formacaoId) {
  return Projeto.findAll({
    where: { formacaoId, publicado: true },
    order: [['id', 'DESC']]
  });
}

export async function criarProjeto(Projeto, Secao, dados) {
  const {
    formacaoId,
    secaoId,
    bimestre,
    titulo,
    descricao,
    tecnologias,
    categoria,
    imagem,
    github,
    link,
    publicado
  } = dados;

  if (!formacaoId || !secaoId || !titulo?.trim() || !descricao?.trim()) {
    const erro = new Error(
      'Formação, seção, título e descrição são obrigatórios.'
    );
    erro.status = 400;
    throw erro;
  }

  const secao = await Secao.findOne({
    where: { id: secaoId, formacaoId }
  });

  if (!secao) {
    const erro = new Error('A seção não pertence à formação selecionada.');
    erro.status = 400;
    throw erro;
  }

  return Projeto.create({
    formacaoId,
    secaoId,
    bimestre,
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    tecnologias,
    categoria,
    imagem,
    github,
    link,
    publicado: publicado ?? true
  });
}

export async function editarProjeto(Projeto, Secao, id, dados) {
  const projeto = await Projeto.findByPk(id);

  if (!projeto) {
    const erro = new Error('Projeto não encontrado.');
    erro.status = 404;
    throw erro;
  }

  const camposPermitidos = [
    'formacaoId',
    'secaoId',
    'bimestre',
    'titulo',
    'descricao',
    'tecnologias',
    'categoria',
    'imagem',
    'github',
    'link',
    'publicado'
  ];

  const atualizacoes = {};

  for (const campo of camposPermitidos) {
    if (dados[campo] !== undefined) {
      atualizacoes[campo] = dados[campo];
    }
  }

  if (atualizacoes.titulo !== undefined && !atualizacoes.titulo.trim()) {
    const erro = new Error('O título não pode ficar vazio.');
    erro.status = 400;
    throw erro;
  }

  if (atualizacoes.descricao !== undefined && !atualizacoes.descricao.trim()) {
    const erro = new Error('A descrição não pode ficar vazia.');
    erro.status = 400;
    throw erro;
  }

  const formacaoId = atualizacoes.formacaoId ?? projeto.formacaoId;
  const secaoId = atualizacoes.secaoId ?? projeto.secaoId;

  const secao = await Secao.findOne({
    where: { id: secaoId, formacaoId }
  });

  if (!secao) {
    const erro = new Error('A seção não pertence à formação selecionada.');
    erro.status = 400;
    throw erro;
  }

  if (atualizacoes.titulo !== undefined) {
    atualizacoes.titulo = atualizacoes.titulo.trim();
  }

  if (atualizacoes.descricao !== undefined) {
    atualizacoes.descricao = atualizacoes.descricao.trim();
  }

  await projeto.update(atualizacoes);

  return projeto;
}

export async function excluirProjeto(Projeto, id) {
  const projeto = await Projeto.findByPk(id);

  if (!projeto) {
    const erro = new Error('Projeto não encontrado.');
    erro.status = 404;
    throw erro;
  }

  await projeto.destroy();
}

export async function listarArquivos(ArquivoProjeto, projetoId) {
  return ArquivoProjeto.findAll({
    where: { projetoId }
  });
}
