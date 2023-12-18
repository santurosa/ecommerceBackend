import { Router } from "express";
import { cartsView, chatView, loginView, productsView, registerView, recoverPasswordView, restartPasswordView } from "../controllers/views.js";
import { publicAccess, privateAccess } from "../middlewares/auth.js";

const router = Router();

router.get("/login", publicAccess, loginView);
router.get("/register", publicAccess, registerView);
router.get("/products", privateAccess, productsView);
router.get("/carts/:cid", privateAccess, cartsView);
router.get("/chat", privateAccess, chatView);
router.get("/recoverPassword", publicAccess, recoverPasswordView);
router.get("/restartPassword", publicAccess, restartPasswordView);

export default router;