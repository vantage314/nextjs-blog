import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validate';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

// 公开路由
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);

// 需要认证的路由
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, validateRequest(updateProfileSchema), authController.updateProfile);
router.put('/password', authenticate, validateRequest(changePasswordSchema), authController.changePassword);

export default router; 