import { Router } from 'express';
import { getCryptos, createCrypto, updateCrypto, deleteCrypto } from '../controllers/cryptoController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, getCryptos);
router.post('/', authenticate, createCrypto);
router.put('/:id', authenticate, updateCrypto);
router.delete('/:id', authenticate, deleteCrypto);

export default router;