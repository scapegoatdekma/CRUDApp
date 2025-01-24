const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = 3000;

const pool = new Pool({
  database: "postgres",
  host: "localhost",
  user: "postgres",
  password: "root",
  port: 5432,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

pool.connect((err, client, release) => {
  if (err) {
    console.log("Ошибка подключения к базе данных", err.stack);
  } else {
    console.log("Подключение к базе данных установлено");
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении товаров:", err.stack);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
