import { Router } from 'express';
import { getPerfil, postPerfil } from '../controllers/perfilController.js';
import { verificarToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getPerfil);
router.post('/', verificarToken, postPerfil);

export default router;