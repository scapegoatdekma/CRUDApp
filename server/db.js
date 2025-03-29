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
  // ssl: {
  //   rejectUnauthorized: false // Отключает проверку сертификата (не для продакшена!)
  //   // Для продакшена используйте:
  //   // ca: fs.readFileSync('/path/to/server-ca.pem').toString(),
  //   // cert: fs.readFileSync('/path/to/client-cert.pem').toString(),
  //   // key: fs.readFileSync('/path/to/client-key.pem').toString(),
  // },
};

export const pool = new Pool(config);