import { Router } from 'express';

import {
  getProjetos,
  postProjeto,
  putProjeto,
  deleteProjeto,
  getArquivos
} from '../controllers/projetoController.js';
import { verificarToken } from '../middleware/auth.js';

const router = Router();

router.get('/:formacaoId', getProjetos);
router.post('/', verificarToken, postProjeto);

router.put('/:id', verificarToken, putProjeto);
router.delete('/:id', verificarToken, deleteProjeto);

router.get('/:projetoId/arquivos', getArquivos);

export default router;