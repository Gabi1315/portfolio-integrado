import { buscarPerfil, salvarPerfil } from '../services/perfilService.js';

export async function getPerfil(req, res) {
  try {
    const perfil = await buscarPerfil(req.app.locals.models.Perfil);
    res.json(perfil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar perfil' });
  }
}

export async function postPerfil(req, res) {
  try {
    const perfil = await salvarPerfil(req.app.locals.models.Perfil, req.body);
    res.status(perfil.createdAt ? 201 : 200).json(perfil);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ erro: error.status ? error.message : 'Erro ao salvar perfil' });
  }
}
