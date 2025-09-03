import { createTransaction, editTransaction, removeTransaction, getTransactions } from "../models/transactionModel.js";

export async function listTransactionsHandler(req, res) {
	try {
		const userId = req.user.id;
		const {
			sortBy = 'created_at',
			sortOrder = 'DESC',
			page = '1',
			limit = '10',
			filterByName = ''
		} = req.query;
		const parsedLimit = Math.max(1, parseInt(limit));
		const parsedPage = Math.max(1, parseInt(page));
		const offset = (parsedPage - 1) * parsedLimit;
		const rows = await getTransactions(userId, parsedLimit, offset, sortBy, sortOrder, filterByName);
		return res.json({ data: rows, page: parsedPage, limit: parsedLimit, hasMore: rows.length === parsedLimit });
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch transactions" });
	}
}

export async function createTransactionHandler(req, res) {
	try {
		const userId = req.user.id;
		const { name, amount, detail } = req.body;
		if (!name || typeof amount !== 'number') {
			return res.status(400).json({ message: 'Invalid payload' });
		}
		const row = await createTransaction(userId, name, amount, detail || null);
		return res.status(201).json(row);
	} catch (err) {
		return res.status(500).json({ message: `Failed to create transaction. ${err.message}` });
	}
}

export async function updateTransactionHandler(req, res) {
	try {
		const transactionId = parseInt(req.params.id);
		const { name, amount, detail } = req.body;
		if (!transactionId || Number.isNaN(transactionId)) {
			return res.status(400).json({ message: 'Invalid transaction id' });
		}
		const row = await editTransaction(transactionId, name, amount, detail || null);
		return res.json(row);
	} catch (err) {
		return res.status(500).json({ message: "Failed to update transaction" });
	}
}

export async function deleteTransactionHandler(req, res) {
	try {
		const transactionId = parseInt(req.params.id);
		if (!transactionId || Number.isNaN(transactionId)) {
			return res.status(400).json({ message: 'Invalid transaction id' });
		}
		const row = await removeTransaction(transactionId);
		return res.json(row);
	} catch (err) {
		return res.status(500).json({ message: "Failed to delete transaction" });
	}
}


