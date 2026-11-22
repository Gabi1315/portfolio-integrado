import { Router } from 'express';
import { getConteudos, postConteudo } from '../controllers/conteudoController.js';

const router = Router();

router.get('/:formacaoId', getConteudos);
router.post('/', postConteudo);

export default router;
