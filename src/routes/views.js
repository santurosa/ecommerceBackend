import { Router } from "express";
import { cartsView, chatView, usersView, loginView, productsView, registerView, recoverPasswordView, restartPasswordView, ticketsView } from "../controllers/views.js";
import { viewAccess } from "../middlewares/auth.js";

const router = Router();

router.get("/login", viewAccess('PUBLIC'), loginView);
router.get("/register", viewAccess('PUBLIC'), registerView);
router.get("/products", viewAccess('PRIVATE'), productsView);
router.get("/carts/:cid", viewAccess('PRIVATE'), cartsView);
router.get("/users", viewAccess('ADMIN'), usersView);
router.get("/tickets", viewAccess('PRIVATE'), ticketsView);
router.get("/chat", viewAccess('PRIVATE'), chatView);
router.get("/recoverPassword", viewAccess('PUBLIC'), recoverPasswordView);
router.get("/restartPassword/:token", viewAccess('PUBLIC'), restartPasswordView);

export default router;