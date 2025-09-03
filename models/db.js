import { Pool } from "pg";
// import dotenv from "dotenv";
// dotenv.config();

// For better user experience, ensure all required env vars are set
const requiredEnv = ['DB_USER','DB_HOST','DB_NAME','DB_PASSWORD','DB_PORT'];
const missing = requiredEnv.filter(k => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing DB env vars: ${missing.join(', ')}. Please set them in .env`);
}

const pool = new Pool({
  user: `${process.env.DB_USER}`,
  host: `${process.env.DB_HOST}`,
  database: `${process.env.DB_NAME}`,
  password: `${process.env.DB_PASSWORD}`,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});


// await pool.connect();
// console.log("Connected to the database");

export default pool;