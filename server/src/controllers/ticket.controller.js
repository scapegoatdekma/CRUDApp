// src/controllers/ticket.controller.js
import { Router } from "express";
import { TicketService } from "../services/ticket.service.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const ticketService = new TicketService();

// Создание нового тикета
router.post("/", async (req, res) => {
  console.log('Request body:', req.body);
console.log('Request files:', req.files);
  let savedAttachments = [];
  
  try {
    // Проверяем наличие обязательных полей
    if (!req.body.title || !req.body.description || !req.body.client_id) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["title", "description", "client_id"] 
      });
    }

    // Обрабатываем файлы (если есть)
    if (req.files && req.files.attachments) {
      const uploadDir = path.join(__dirname, "../../public/uploads");
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Нормализуем файлы в массив (работает и для одного файла)
      const files = Array.isArray(req.files.attachments) 
        ? req.files.attachments 
        : [req.files.attachments];

      for (const file of files) {
        const uniqueName = `${Date.now()}-${file.name}`;
        const uploadPath = path.join(uploadDir, uniqueName);
        
        await file.mv(uploadPath); // Сохраняем файл
        
        savedAttachments.push({
          name: file.name,
          path: `/uploads/${uniqueName}`,
          size: file.size,
          type: file.mimetype,
        });
      }
    }

    // Создаем тикет
    const ticket = await ticketService.createTicket({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority || 2, // По умолчанию "Средний"
      category: req.body.category || 'Другое',
      client_id: req.body.client_id,
      creator_name: req.body.creator_name,
      attachments: savedAttachments,
    });

    res.status(201).json({
      success: true,
      ticket
    });

  } catch (error) {
    console.error("Ошибка при создании тикета:", error);
    
    // Удаляем уже сохраненные файлы при ошибке
    if (savedAttachments.length > 0) {
      savedAttachments.forEach(attachment => {
        try {
          fs.unlinkSync(path.join(__dirname, '../../public', attachment.path));
        } catch (err) {
          console.error("Не удалось удалить файл:", attachment.path, err);
        }
      });
    }

    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
});
// Получение списка тикетов
router.get("/", async (req, res) => {
  try {
    const filters = {
      clientId: req.query.clientId, // ID клиента
      status: req.query.status, // Фильтр по статусу
      priority: req.query.priority, // Фильтр по приоритету
    };

    // Получаем тикеты с фильтрами
    const tickets = await ticketService.getTickets(filters);
    console.log(tickets);
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Ошибка при получении тикетов:", error);
    res.status(500).json({ error: "Ошибка при получении тикетов" });
  }
});

// Получение тикета по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID тикета
    // const { clientId } = req.query; // ID клиента

    // Получаем тикет по ID
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      return res.status(404).json({ error: "Тикет не найден" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Ошибка при получении тикета:", error);
    res.status(500).json({ error: "Ошибка при получении тикета" });
  }
});

// Обновление тикета
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID тикета
    const { title, description, priority, category, status_id, attachments } = req.body;

    // Обновляем тикет
    const updatedTicket = await ticketService.updateTicket(id, {
      title,
      description,
      priority,
      category,
      status_id,
      attachments,
    });

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Ошибка при обновлении тикета:", error);
    res.status(500).json({ error: "Ошибка при обновлении тикета" });
  }
});

// Удаление тикета
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // ID тикета

    // Удаляем тикет
    const deletedTicket = await ticketService.deleteTicket(id);

    if (!deletedTicket) {
      return res.status(404).json({ error: "Тикет не найден" });
    }

    res.status(200).json(deletedTicket);
  } catch (error) {
    console.error("Ошибка при удалении тикета:", error);
    res.status(500).json({ error: "Ошибка при удалении тикета" });
  }
});

export const ticketRouter = router;