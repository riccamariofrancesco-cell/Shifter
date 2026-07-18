import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);

// Protected route to get current user
router.get('/me', authenticate, (req, res) => {
  const user = (req as any).user;
  res.json({ user });
});

export default router;