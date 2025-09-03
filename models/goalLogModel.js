/*
    ADD SAVING LOG
    GET SAVING LOG
*/

import pool from './db.js';

async function updateCurrentSaved(goalId,amount){
    try{
        const res= await pool.query(
            `
                UPDATE goals
                SET current_saved = current_saved + $1
                WHERE goal_id=$2
                RETURNING *;
            `,[amount,goalId]
        );
        return res.rows[0];
    } catch(err){
        console.error("Error updating current saved amount:", err);
        throw err;
    }
}

export async function addSavingLog(goalId, amount, note=null){
    try{
        const res = await pool.query(
            `
                INSERT INTO goal_saving_log (goal_id, amount_saved, note)
                VALUES ($1, $2, $3)
                RETURNING *
            `,[goalId, amount, note]
        );
        await updateCurrentSaved(goalId, amount);
        return res.rows[0];
    } catch(err){
        console.error("Error adding saving log:", err);
        throw err;
    }
}

export async function getSavingLogs(goalId){
    try{
        const res = await pool.query(
            `
                SELECT * FROM goal_saving_log
                WHERE goal_id = $1
                ORDER BY saved_at DESC
            `,[goalId]
        )
        return res.rows;
    } catch(err){
        console.error("Error fetching saving logs:", err);
        throw err;
    }
}