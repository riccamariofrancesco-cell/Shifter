const express = require('express');
const router = express.Router();

const { getAccounts, createAccount, updateAccount, deleteAccount } = require('../../../src/controllers/accountsController');
const { authenticate } = require('../../../src/middleware/authMiddleware');

router.get('/', authenticate, getAccounts);
router.post('/', authenticate, createAccount);
router.put('/:id', authenticate, updateAccount);
router.delete('/:id', authenticate, deleteAccount);

module.exports = router;