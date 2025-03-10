import jwt from 'jsonwebtoken';
import pkg from 'pg';
const { Pool } = pkg;
import { config } from '../../db.js';

const pool = new Pool(config);
const secretKey = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const decoded = jwt.verify(token, secretKey);
    
    // Проверяем существование пользователя в БД
    const { rows } = await pool.query(
      'SELECT id, username, role, avatar FROM users WHERE id = $1',
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = {
      id: rows[0].id,
      username: rows[0].username,
      role: rows[0].role,
      avatar: `http://localhost:4200${rows[0].avatar}`
    };

    next();
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Срок действия токена истек' });
    }
    
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};