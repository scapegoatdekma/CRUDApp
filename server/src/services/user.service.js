import pkg from "pg";

import { config } from "../../db.js";
const { Pool } = pkg;
const pool = new Pool(config);

export class UserService {
  async checkOverlap(user) {
    const overlap = await pool.query(
      "SELECT COUNT(*) FROM users WHERE email = $1",
      [user.email]
    );
    const count = parseInt(overlap.rows[0].count, 10);
    return count > 0;
  }
  async createUser(user) {
    const { rows } = await pool.query(
      "INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *",
      [user.username, user.email, user.password]
    );

    return rows; // Возвращаем только первый (и единственный) элемент массива
  }
  async getUser(user) {
    // console.log(user);
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE password = $1",
      [user.password]
    );
    console.log(rows);
    return rows;
  }
  async loginUser(user) {}
}
