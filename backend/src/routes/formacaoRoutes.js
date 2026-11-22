import { Router } from 'express';
import { getFormacoes, getSecoes, postSecao } from '../controllers/formacaoController.js';

const router = Router();

router.get('/', getFormacoes);
router.get('/secoes/:formacaoId', getSecoes);
router.post('/secoes', postSecao);

export default router;
