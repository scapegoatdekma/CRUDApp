import { Router } from "express";
import { UserService } from "../services/user.service.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const userService = new UserService();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const avatar = req.files && req.files.avatar; // Обрабатываем отсутствие файла

    console.log("username:", username);
    console.log("email:", email);
    console.log("password:", password);
    console.log("avatar:", avatar);

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const overlap = await userService.checkOverlap(req.body);

    if (overlap) {
      return res
        .status(401)
        .json({ error: "Пользователь с такой почтой уже существует" });
    }
    let avatarUrl = null;

    if (req.files && req.files.avatar) {
      const avatar = req.files.avatar;
      const uploadDir = path.join(__dirname, "../../public/uploads");
      const uniqueFilename =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(avatar.name);
      const uploadPath = path.join(uploadDir, uniqueFilename);

      const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedMimes.includes(avatar.mimetype)) {
        return res.status(400).json({
          error:
            "Недопустимый тип файла. Разрешены только форматы JPEG, PNG и GIF",
        });
      }
      try {
        await avatar.mv(uploadPath);
        avatarUrl = `/uploads/${uniqueFilename}`;
      } catch (error) {
        console.error("Ошибка при сохранении файла:", error);
      }
    }

    const userData = {
      username: username,
      email: email,
      password: password,
      avatar: avatarUrl,
    };
    const user = await userService.createUser(userData);
    console.log("Данные пользователя:", user);
    res.status(201).json(user);
  } catch (error) {
    console.error(`Ошибка при создании пользователя: ${error}`);
    res.status(500).json({ error: "Ошибка при создании пользователя" });
  }
});
router.get("/", async (req, res) => {
  try {
    const user = await userService.getUser(req.query);
    res.status(201).json(user);
  } catch (error) {
    console.error(`Ошибка получения меню: ${error}`);
    res.status(401).json({ error: error });
  }
});

router.get("/auth", async (req, res) => {
  try {
    const { username, password } = req.query;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const user = await userService.loginUser(username, password);
    res.status(201).json(user);
  } catch (error) {
    console.error(`Ошибка при авторизации пользователя: ${error}`);
    res.status(500).json({ error: "Неверный логин или пароль" });
  }
});

export const userRouter = router;
