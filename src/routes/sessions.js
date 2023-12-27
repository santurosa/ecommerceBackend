import { Router } from "express";
import passport from "passport";
import { current, failLogin, failRegister, githubcallback, login, logout, register } from "../controllers/sessions.js";
import { applyPolicy } from "../middlewares/auth.js";

const router = Router();

router.post("/login", applyPolicy(['PUBLIC']), passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), login);
router.get("/faillogin", applyPolicy(['PUBLIC']), failLogin);
router.post("/register", applyPolicy(['PUBLIC']), passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), register);
router.get("/failregister", applyPolicy(['PUBLIC']), failRegister);
router.get("/logout", applyPolicy(['ADMIN', 'USER', 'USER_PREMIUM']), logout);
router.get("/github", applyPolicy(['PUBLIC']), passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });
router.get("/githubcallback", applyPolicy(['PUBLIC']), passport.authenticate("github", { failureRedirect: "/login" }), githubcallback);
router.get("/current", applyPolicy(['ADMIN', 'USER', 'USER_PREMIUM']), current);

export default router;