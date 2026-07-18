const express = require('express');
const router = express.Router();

const { getCryptos, createCrypto, updateCrypto, deleteCrypto } = require('../../../src/controllers/cryptoController');
const { authenticate } = require('../../../src/middleware/authMiddleware');

router.get('/', authenticate, getCryptos);
router.post('/', authenticate, createCrypto);
router.put('/:id', authenticate, updateCrypto);
router.delete('/:id', authenticate, deleteCrypto);

module.exports = router;