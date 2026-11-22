
import {
  listarProjetos,
  criarProjeto,
  editarProjeto,
  excluirProjeto,
  listarArquivos
} from '../services/projetoService.js';

export async function getProjetos(req, res) {
  try {
    const { Projeto } = req.app.locals.models;
    const projetos = await listarProjetos(Projeto, req.params.formacaoId);

    res.status(200).json(projetos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar projetos.' });
  }
}

export async function postProjeto(req, res) {
  try {
    const { Projeto, Secao } = req.app.locals.models;

    const projeto = await criarProjeto(Projeto, Secao, req.body);

    res.status(201).json(projeto);
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      erro: error.status ? error.message : 'Erro ao cadastrar projeto.'
    });
  }
}

export async function putProjeto(req, res) {
  try {
    const { Projeto, Secao } = req.app.locals.models;

    const projeto = await editarProjeto(
      Projeto,
      Secao,
      req.params.id,
      req.body
    );

    res.status(200).json(projeto);
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      erro: error.status ? error.message : 'Erro ao editar projeto.'
    });
  }
}

export async function deleteProjeto(req, res) {
  try {
    const { Projeto } = req.app.locals.models;

    await excluirProjeto(Projeto, req.params.id);

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      erro: error.status ? error.message : 'Erro ao excluir projeto.'
    });
  }
}

export async function getArquivos(req, res) {
  try {
    const { ArquivoProjeto } = req.app.locals.models;

    const arquivos = await listarArquivos(
      ArquivoProjeto,
      req.params.projetoId
    );

    res.status(200).json(arquivos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar arquivos.' });
  }
}
