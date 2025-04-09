import { Router } from "express";
import { UserService } from "../services/user.service.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { pool } from "../../db.js";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const userService = new UserService();

// Ограничение запросов для /auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Слишком много попыток входа. Попробуйте позже."
});

// Регистрация пользователя
router.post(
  "/",
  async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const avatar = req.files?.avatar;

    // Валидация вручную
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        errors: [
          { path: "username", msg: "Имя пользователя обязательно" },
          { path: "email", msg: "Некорректный формат email" },
          { path: "password", msg: "Пароль должен содержать минимум 8 символов" },
        ],
      });
    }
    else {
      console.log("DATA:", username, email, password);
    }

    try {
      // Проверка существования пользователя
      const emailExists = await userService.checkEmailExists(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          error: "Пользователь с таким email уже существует"
        });
      }

      // Обработка аватара
      let avatarUrl = null;
      if (avatar) {
        const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
        if (!allowedMimes.includes(avatar.mimetype)) {
          return res.status(400).json({
            success: false,
            error: "Разрешены только изображения в формате JPEG, PNG или GIF"
          });
        }

        const uploadDir = path.join(__dirname, "../../public/uploads/avatars");
        const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(avatar.name)}`;
        const uploadPath = path.join(uploadDir, uniqueFilename);

        await avatar.mv(uploadPath);
        avatarUrl = `/uploads/avatars/${uniqueFilename}`;
      }

      // Создание пользователя
      const newUser = await userService.createUser({
        username,
        email,
        password,
        avatar: avatarUrl
      });

      // Генерация токена
      const token = userService.generateToken(newUser);

      res.status(201).json({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          avatar: `http://localhost:4200${newUser.avatar}`,
          role: newUser.role
        },
        token
      });
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      res.status(500).json({
        success: false,
        error: "Внутренняя ошибка сервера при регистрации",
      });
    }
  }
);

// Аутентификация пользователя
router.post("/auth", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email и пароль обязательны для входа"
    });
  }

  try {
    const user = await userService.validateUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Неверные учетные данные"
      });
    }

    const token = userService.generateToken(user);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: `http://localhost:4200${user.avatar}`,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error("Ошибка аутентификации:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера при аутентификации"
    });
  }
});

// Получение информации о текущем пользователе
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Получаем ID из токена (authMiddleware должен добавлять user в req)
    const userId = req.user.id; // Предполагая, что authMiddleware добавляет user
    
    const { rows } = await pool.query(
      `SELECT u.id, u.username, u.email, u.avatar, u.role, u.created_at,
              ep.position, ep.points, ep.rating
       FROM users u
       LEFT JOIN employee_profiles ep ON u.id = ep.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        error: "Пользователь не найден"
      });
    }

    const user = rows[0];
    user.avatar = user.avatar 
      ? `http://localhost:4200${user.avatar}`
      : 'http://localhost:4200/default-avatar.png';

    res.json({ success: true, user });
  } catch (error) {
    console.error("Ошибка:", error);
    res.status(500).json({ 
      success: false,
      error: "Внутренняя ошибка сервера" 
    });
  }
});

export const userRouter = router;