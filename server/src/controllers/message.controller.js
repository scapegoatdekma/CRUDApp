import { Router } from "express";
import { MessageService } from "../services/message.service.js";


const router = Router();

router.get('/', async (req, res) => {
    try {
        const messages = await MessageService.getMessages();
        res.status(200).json(messages);
    } catch (error) {
        console.error("Ошибка при получении сообщений:", error);
        res.status(500).json({ 
            error: "Internal Server Error",
            message: "Не удалось получить сообщения" 
        });
    }
});


export const messageRouter = router;