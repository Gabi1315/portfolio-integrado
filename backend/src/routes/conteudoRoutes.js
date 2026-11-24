import { Router } from 'express';
import { getConteudos, postConteudo } from '../controllers/conteudoController.js';
import { verificarToken } from '../middleware/auth.js';

const router = Router();

router.get('/:formacaoId', getConteudos);
router.post('/', verificarToken, postConteudo);

export default router;