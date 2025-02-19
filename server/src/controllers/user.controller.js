import { Router } from "express";
import { UserService } from "../services/user.service.js";

const router = Router();
const userService = new UserService();

router.post("/", async (req, res) => {
  try {
    const overlap = await userService.checkOverlap(req.body);

    if (overlap) {
      res
        .status(401)
        .json({ error: "Пользователь с такой почтой уже существует" });
    } else {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    }
  } catch (error) {}
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

export const userRouter = router;
