import { Router } from "express";
import passport from "passport";
import { current, failLogin, failRegister, githubcallback, login, logout, recoverPassword, register, restartPassword, updateRole } from "../controllers/sessions.js";

const router = Router();

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), login);
router.get("/faillogin", failLogin);
router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), register);
router.get("/failregister", failRegister);
router.get("/logout", logout);
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubcallback);
router.get("/current", current);
router.get("/recoverPassword", recoverPassword);
router.post("/restartPassword", restartPassword);
router.put("/updateRole/:uid", updateRole);

export default router;