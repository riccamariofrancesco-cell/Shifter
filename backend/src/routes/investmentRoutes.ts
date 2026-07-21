import { Router } from 'express';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '../controllers/investmentController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate); // protect all routes

router.get('/', getInvestments);
router.post('/', createInvestment);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

export default router;