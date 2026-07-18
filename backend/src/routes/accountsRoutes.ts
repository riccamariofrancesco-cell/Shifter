import { Router } from 'express';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '../controllers/accountsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getAccounts);
router.post('/', authenticate, createAccount);
router.put('/:id', authenticate, updateAccount);
router.delete('/:id', authenticate, deleteAccount);

export default router;