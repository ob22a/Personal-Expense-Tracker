import pool from './db.js';

export async function getMonthlySummary(ownerId){
    try{
        const res = await pool.query(
            `
                SELECT * FROM monthly_summary
                WHERE owner_id = $1
            `,[ownerId]
        );
        console.log(res.rows);
        return res.rows;
    } catch (err) {
        console.error('Error fetching monthly summary:', err);
        throw err;
    }
}