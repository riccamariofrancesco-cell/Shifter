const express = require('express');
const router = express.Router();

const { getInvestments, createInvestment, updateInvestment, deleteInvestment } = require('../../../src/controllers/investmentsController');
const { authenticate } = require('../../../src/middleware/authMiddleware');

router.get('/', authenticate, getInvestments);
router.post('/', authenticate, createInvestment);
router.put('/:id', authenticate, updateInvestment);
router.delete('/:id', authenticate, deleteInvestment);

module.exports = router;