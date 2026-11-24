import { Router } from 'express';
import { getFormacoes, getSecoes, postSecao } from '../controllers/formacaoController.js';
import { verificarToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getFormacoes);
router.get('/secoes/:formacaoId', getSecoes);
router.post('/secoes', verificarToken, postSecao);

export default router;