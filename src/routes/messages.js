import { Router } from "express";
import { addMessage, getMessages } from "../controllers/messages.js";
import { applyPolicy } from "../middlewares/auth.js";

const router = Router();

router.get("/", getMessages);
router.post("/", applyPolicy(['USER']), addMessage);

export default router