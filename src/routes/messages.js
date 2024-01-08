import { Router } from "express";
import { addMessage, getMessages } from "../controllers/messages.js";
import { applyPolicy } from "../middlewares/auth.js";

const router = Router();

router.get("/", applyPolicy(['PUBLIC']), getMessages);
router.post("/", applyPolicy(['ADMIN', 'USER', 'USER_PREMIUM']), addMessage);

export default router