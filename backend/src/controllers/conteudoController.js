import { listarConteudos, criarConteudo } from '../services/conteudoService.js';

export async function getConteudos(req, res) {
  try {
    const { Conteudo } = req.app.locals.models;
    res.json(await listarConteudos(Conteudo, req.params.formacaoId));
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar conteúdos' });
  }
}

export async function postConteudo(req, res) {
  try {
    const { Conteudo } = req.app.locals.models;
    const conteudo = await criarConteudo(Conteudo, req.body);
    res.status(201).json(conteudo);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro ao cadastrar conteúdo' });
  }
}
