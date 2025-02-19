import { config } from "./db.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRouter } from "./src/controllers/user.controller.js";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "client")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.SERVER_PORT;

const pool = new Pool(config);

// app.use("api/auth");
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}/`);
});

pool.connect((err) => {
  if (err) {
    console.error(`Ошибка подключения к бд: ${err}`);
  } else {
    console.log("Подключение к бд установлено");
  }
});
