import { config } from "./db.js";
import express from "express";
import cors from "cors";
import { userRouter } from "./src/controllers/user.controller.js";
import { ticketRouter } from "./src/controllers/ticket.controller.js";
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from 'http';
import { setupChat } from './chatHandler.js'; // Импортируем модуль чата
import fileUpload from 'express-fileupload'; // Добавляем express-fileupload
import { messageRouter } from "./src/controllers/message.controller.js";

console.log()

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app); // Создаем HTTP-сервер для Express и Socket.IO

// Настройки Express
app.use(express.static(path.join(__dirname, "client")));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json()); // ДО fileUpload
app.use(express.urlencoded({ extended: true })); // ДО fileUpload
app.use(fileUpload({
  createParentPath: true, 
  limits: { 
    fileSize: 25 * 1024 * 1024, // 25MB
    files: 5 // Макс. 5 файлов
  },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  safeFileNames: true,
  preserveExtension: true
}));


const PORT = process.env.SERVER_PORT || 3000; // Порт для сервера
const pool = new Pool(config);

// Роутеры
app.use("/api/users", userRouter);
// app.use("/api/users", userRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/messages", messageRouter);

// Настройка WebSocket для чата
setupChat(httpServer); // Инициализируем чат

// Запуск сервера
httpServer.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Доступен по адресу http://192.168.1.119:${PORT}`);
  console.log(`WebSocket доступен на ws://192.168.1.119:${PORT}`);
});

// Подключение к БД
pool.connect((err) => {
  if (err) {
    console.error(`Ошибка подключения к бд: ${err}`);
  } else {
    console.log("Подключение к бд установлено");
  }
});
