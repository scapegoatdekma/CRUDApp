import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "../../db.js";
const { Pool } = pkg;
const pool = new Pool(config);

const secretKey = process.env.JWT_SECRET;
export class UserService {
  async checkOverlap(user) {
    const overlap = await pool.query(
      "SELECT COUNT(*) FROM users WHERE email = $1",
      [user.email]
    );
    const count = parseInt(overlap.rows[0].count, 10);
    return count > 0;
  }
  async createUser(userData) {
    const { username, email, password, avatar } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const { rows } = await pool.query(
        "INSERT INTO users (username, email, password, avatar, created_at, updated_at) VALUES($1, $2, $3, $4, NOW(), NOW()) RETURNING *",
        [username, email, hashedPassword, avatar]
      );
      const user = rows[0];

      user.avatar = `http://localhost:4200${user.avatar}`;

      return user;
    } catch (error) {
      console.error("Ошибка при создании пользователя в UserService:", error);
      throw new Error("Не удалось создать пользователя в базе данных.");
    }
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
  async loginUser(username, password) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      if (rows.length === 0) {
        throw new Error("Неверный логин или пароль");
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error("Неверный логин или пароль");
      }

      // Создаем JWT токен
      const token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "1h" } // Установите срок действия токена
      );

      // Возвращаем только нужные поля, исключая хэш пароля
      return {
        token: token,
        username: user.username,
        avatar: `http://localhost:4200${user.avatar}`,
      };
    } catch (error) {
      console.error("Ошибка при входе пользователя в UserService:", error);
      throw error;
    }
  }
}
