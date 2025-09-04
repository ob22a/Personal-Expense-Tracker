import { Router } from 'express';
import { listTransactionsHandler, createTransactionHandler, updateTransactionHandler, deleteTransactionHandler } from '../controllers/transactionController.js';

const router = Router();

router.get('/', listTransactionsHandler);
router.post('/', createTransactionHandler);
router.put('/:id', updateTransactionHandler);
router.delete('/:id', deleteTransactionHandler);

export default router;
