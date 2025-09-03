import { getMonthlySummary } from "../models/reportsModel.js";

export async function monthlySummaryHandler(req, res) {
	try {
		const ownerId = req.user.id;
		const rows = await getMonthlySummary(ownerId);
		return res.json({ data: rows });
	} catch (err) {
		return res.status(500).json({ message: "Failed to fetch monthly summary" });
	}
}