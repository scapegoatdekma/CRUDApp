import { config } from "./db.js";
import express from "express";
import cors from "cors";
import { userRouter } from "./src/controllers/user.controller.js";
import { ticketRouter } from "./src/controllers/ticket.controller.js";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "client")));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT;

const pool = new Pool(config);

// app.use("api/auth");
app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);

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
