import { getSavingLogs, addSavingLog } from "../models/goalLogModel.js";

export async function getGoalLogsHandler(req, res) {
	try {
		const goalId = parseInt(req.params.goalId);
		if (!goalId || Number.isNaN(goalId)) {
			return res.status(400).json({ message: "Invalid goalId" });
		}
		const logs = await getSavingLogs(goalId);
		return res.json({ data: logs });
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch goal logs" });
	}
}

export async function addGoalLogHandler(req, res) {
	try {
		const goalId = parseInt(req.params.goalId);
		const { amount, note } = req.body;
		
		if (!goalId || Number.isNaN(goalId)) {
			return res.status(400).json({ message: "Invalid goalId" });
		}
		if (!amount || Number.isNaN(amount) || amount <= 0) {
			return res.status(400).json({ message: "Invalid amount" });
		}
		
		const log = await addSavingLog(goalId, parseFloat(amount), note);
		return res.json({ data: log });
	} catch (err) {
		return res.status(500).json({ message: "Failed to add saving log" });
	}
}
