import { Router } from 'express';
import { loginAdmin } from '../controllers/authController.js';
import { limitarLogin } from '../middleware/limiteLogin.js';

const router = Router();

router.post('/login', limitarLogin, loginAdmin);

export default router;