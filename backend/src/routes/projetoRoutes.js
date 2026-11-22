
import { Router } from 'express';

import {
  getProjetos,
  postProjeto,
  putProjeto,
  deleteProjeto,
  getArquivos
} from '../controllers/projetoController.js';

const router = Router();

router.get('/:formacaoId', getProjetos);
router.post('/', postProjeto);

router.put('/:id', putProjeto);
router.delete('/:id', deleteProjeto);

router.get('/:projetoId/arquivos', getArquivos);

export default router;
