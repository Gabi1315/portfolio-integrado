import { listarFormacoes, listarSecoes, criarSecao } from '../services/formacaoService.js';

export async function getFormacoes(req, res) {
  try {
    const { Formacao } = req.app.locals.models;
    res.json(await listarFormacoes(Formacao));
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar formações' });
  }
}

export async function getSecoes(req, res) {
  try {
    const { Secao } = req.app.locals.models;
    res.json(await listarSecoes(Secao, req.params.formacaoId));
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar seções' });
  }
}

export async function postSecao(req, res) {
  try {
    const { Secao } = req.app.locals.models;
    const secao = await criarSecao(Secao, req.body);
    res.status(201).json(secao);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro ao cadastrar seção' });
  }
}
