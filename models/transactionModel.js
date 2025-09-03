import pool from './db.js';

/*
    CREATE TRANSACTION
    REMOVE TRANSACTION
    EDIT TRANSACTION
    GET TRANSACTION( WITH LIMIT, OFFSET, SORTING, FILTERING)
    COUNT TRANSACTIONS
*/

const PG_INTEGER_MAX = 2147483647;

export async function createTransaction(userId, name, amount, detail){
    try{
        if(amount>PG_INTEGER_MAX){
            throw new Error("Number is too large");
        }
        const result = await pool.query(
            `
                INSERT INTO transactions(owner_id,transaction_name,transaction_amount,transaction_detail)
                VALUES($1,$2,$3,$4)
                RETURNING *;
            `,[userId,name,amount,detail]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
}

export async function removeTransaction(transactionId){
    try{
        const result = await pool.query(
            `
                UPDATE transactions
                SET deleted_at = NOW()
                WHERE transaction_id = $1 AND deleted_at IS NULL
                RETURNING *;
            `,[transactionId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error removing transaction:", error);
        throw error;
    }   
}

export async function editTransaction(transactionId, name, amount, detail){
    try{
        const result = await pool.query(
            `
                UPDATE transactions
                SET transaction_name = $1, transaction_amount = $2, transaction_detail = $3
                WHERE transaction_id = $4 AND deleted_at IS NULL
                RETURNING *;
            `,[name, amount, detail, transactionId]
        )
        return result.rows[0];
    }
    catch (error) {
        console.error("Error editing transaction:", error);
        throw error;
    }
}

export async function getTransactions(userId, limit = 10, offset =0, sortBy = 'created_at', sortOrder = 'DESC', filterByName = ''){
    try{
        const validSortColumns = ['created_at', 'transaction_name', 'transaction_amount'];
        if (!validSortColumns.includes(sortBy)) {
            sortBy = 'created_at';
            console.warn(`Invalid sortBy column. Defaulting to 'created_at'.`);
        }

        const validSortOrders = ['ASC', 'DESC'];
        if (!validSortOrders.includes(sortOrder.toUpperCase())) {
            sortOrder = 'DESC';
            console.warn(`Invalid sortOrder. Defaulting to 'DESC'.`);
        }

        const result = await pool.query(
            `
                SELECT * FROM transactions
                WHERE owner_id = $1 AND deleted_at IS NULL AND transaction_name ILIKE $2
                ORDER BY ${sortBy} ${sortOrder}
                LIMIT $3 OFFSET $4;
            `,[userId, `%${filterByName}%`, limit, offset]
        );
        return result.rows;
    } catch (error) {
        console.error("Error getting transactions:", error);
        throw error;
    }
}


export async function countTransactions(userId){
    try{
        const res = await pool.query(
            `
                SELECT COUNT(*)::int AS total
                FROM transactions
                WHERE owner_id = $1 AND deleted_at IS NULL;
            `,[userId]
        );
        return res.rows[0].total;
    } catch (error) {
        console.error("Error counting transactions:", error);
        throw error;
    }
}