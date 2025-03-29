import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../db.js';

const secretKey = process.env.JWT_SECRET || "default_secret_key";

export class UserService {
  async checkEmailExists(email) {
    const { rows } = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)',
      [email]
    );
    return rows[0].exists;
  }

  async createUser(userData) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password, avatar)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, avatar, role`,
      [
        userData.username,
        userData.email,
        hashedPassword,
        userData.avatar || '/default-avatar.png'
      ]
    );
    console.log(rows);
    
    return rows[0];
  }

  async validateUser(email, password) {
    const { rows } = await pool.query(
      'SELECT id, username, password, role, avatar, email FROM users WHERE email = $1',
      [email]
    );

    if (!rows.length) return null;
    
    const isValid = await bcrypt.compare(password, rows[0].password);
    return isValid ? rows[0] : null;
  }

  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      secretKey,
      { expiresIn: '8h' }
    );
  }
}