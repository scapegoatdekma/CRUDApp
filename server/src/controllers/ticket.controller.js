import { Router } from "express";
import { TicketService } from "../services/ticket.service.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middleware/auth.middleware.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const ticketService = new TicketService();

router.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Создание нового тикета
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, category, client_id } = req.body;
    const attachments = req.files; // Файлы доступны здесь

    console.log("Полученные файлы:", attachments);

    // Проверка наличия файлов
    if (!attachments) {
      console.log("Файлы не были переданы");
      return res.status(400).json({ error: "Файлы не были переданы" });
    }

    // Создаем папку для загрузки, если она не существует
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Сохраняем файлы на сервере
    const savedAttachments = [];
    for (const key in attachments) {
      const file = attachments[key];
      const uploadPath = path.join(uploadDir, file.name);
      await file.mv(uploadPath); // Сохраняем файл
      savedAttachments.push({
        name: file.name,
        path: `/uploads/${file.name}`,
        size: file.size,
        type: file.mimetype
      });
    }

    // Создаем тикет с вложениями
    const ticket = await ticketService.createTicket({
      title,
      description,
      priority,
      category,
      client_id,
      attachments: savedAttachments
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error("Ошибка при создании тикета:", error);
    res.status(500).json({ error: "Ошибка при создании тикета" });
  }
});

// Остальные роуты...
export const ticketRouter = router;