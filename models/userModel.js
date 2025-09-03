/*
    CREATE USER
    GET USER BY EMAIL
    SAVE REFRESH TOKEN 
    GET REFRESH TOKEN 

    REFRESH TOKEN IS ALSO CALLED WHEN THE USER IS NOT NEW SO IT IS GOOD TO SEPARATE
*/

import pool from "./db.js";

export async function createUser(fullName,email,hashedPassword){
    try{
        const result = await pool.query(
            `
                INSERT INTO users(full_name,email,password_hash)
                VALUES ($1,$2,$3)
                RETURNING user_id,full_name,email
            `, [fullName,email,hashedPassword]
        );
        return result.rows[0];
    }
    catch(err){
        console.error("Error creating user", err);
        throw err;
    }
};

export async function getUserByEmail(email){
    try{
        const user = await pool.query(
            `
                SELECT * FROM users WHERE email=$1
             `,[email]
        );
        return user.rows[0];
    }
    catch(err){
        console.error("Error fetching user by email", err);
        throw err;
    }
}

export async function saveRefreshToken(userId,token,expiresAt){
    try{
        await pool.query(
            `
                UPDATE users
                SET refresh_token=$1, expires_at=$2
                WHERE user_id=$3
            `,[token,expiresAt,userId]
        );
    }
    catch(err){
        console.error("Error saving refresh token", err);
        throw err;
    }
}

export async function getRefreshToken(userId){
    try{
        const result = await pool.query(
            `
                SELECT refresh_token FROM users
                WHERE user_id=$1
            `,[userId]
        )
        //console.log(result.rows);
        return result.rows[0]?.refresh_token;
    }
    catch(err){
        console.error("Error getting refresh token", err);
        throw err;
    }
}