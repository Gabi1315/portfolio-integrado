import { Router } from 'express';
import { getPerfil, postPerfil } from '../controllers/perfilController.js';

const router = Router();

router.get('/', getPerfil);
router.post('/', postPerfil);

export default router;
