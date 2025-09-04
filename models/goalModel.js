/* 
    CREATE GOAL
    UPDATE GOAL
    DELETE GOAL
    GET GOALS
    GET GOAL BY ID 
*/ 

import pool from './db.js';

function freqValidator(freq){
    const validFreq = ['daily','weekly','monthly'];
    if(!validFreq.includes(freq)){
        console.warn(`Invalid frequency provided ${freq}. Defaulting to 'daily'.`);
        freq='daily';
    }
    return freq;
}

export async function createGoal(ownerId,name,totalAmount,freq,goalDeadline){
    try{
        freq = freqValidator(freq);
        const res = await pool.query(
            `
                INSERT INTO goals(owner_id,goal_name,total_amount,saving_freq,goal_deadline)
                VALUES($1,$2,$3,$4,$5)
                RETURNING *;
            `,[ownerId,name,totalAmount,freq,goalDeadline]
        );
        return res.rows[0];
    } catch(err){
        console.error("Error creating goal:", err);
        throw err;
    }
}

export async function updateGoal(goalId,name,totalAmount,freq,goalDeadline){
    try{
        freq = freqValidator(freq);
        const res = await pool.query(
            `
                UPDATE goals
                SET goal_name=$1, total_amount=$2, saving_freq=$3, goal_deadline=$4
                WHERE goal_id=$5
                RETURNING *;
            `,[name,totalAmount,freq,goalDeadline,goalId]
        );
        return res.rows[0];
    } catch(err){
        console.error("Error updating goal:", err);
        throw err;
    }
}

export async function deleteGoal(goalId){
    try{
        const res = await pool.query(
            `
                UPDATE goals
                SET deleted_at=NOW()
                WHERE goal_id=$1
                RETURNING *;
            `,[goalId]
        );
        return res.rows[0];
    } catch(err){
        console.error("Error deleting goal:", err);
        throw err;
    }
}  

export async function getGoals(userId){
    try{
        const res = await pool.query(
            `
                SELECT * FROM goals
                WHERE owner_id=$1 AND deleted_at IS NULL;
            `,[userId]
        );
        //console.log(res.rows);
        return res.rows;
    } catch(err){
        console.error("Error retrieving goal:", err);
        throw err;
    }
}

export async function getGoal(goalId){
    try{
        const res = await pool.query(
            `
                SELECT * FROM goals
                WHERE goal_id=$1 AND deleted_at IS NULL;
            `
        );
        return res.rows;
    } catch(err){
        console.error("Error retrieving goal:", err);
        throw err;
    }
}