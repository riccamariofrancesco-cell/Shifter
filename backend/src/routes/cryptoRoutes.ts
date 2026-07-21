import { Router } from 'express';
import { getCrypto, createCrypto, updateCrypto, deleteCrypto } from '../controllers/cryptoController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate); // protect all routes

router.get('/', getCrypto);
router.post('/', createCrypto);
router.put('/:id', updateCrypto);
router.delete('/:id', deleteCrypto);

export default router;