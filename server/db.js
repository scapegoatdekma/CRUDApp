import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

export const config = {
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

export const pool = new Pool(config);