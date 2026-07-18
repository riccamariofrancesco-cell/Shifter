import { Router } from 'express';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '../controllers/investmentsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getInvestments);
router.post('/', authenticate, createInvestment);
router.put('/:id', authenticate, updateInvestment);
router.delete('/:id', authenticate, deleteInvestment);

export default router;