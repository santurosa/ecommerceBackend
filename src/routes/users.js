import { Router } from "express";
import { deleteInactiveUsers, deleteUser, getUsers, recoverPassword, restartPassword, updateDocuments, updateRole } from "../controllers/users.js";
import { applyPolicy } from "../middlewares/auth.js";
import { uploader } from "../utils/multer.js";

const router = Router();

router.get("/", applyPolicy(['ADMIN']), getUsers);
router.get("/recoverPassword", applyPolicy(['PUBLIC']), recoverPassword);
router.post("/restartPassword", applyPolicy(['PUBLIC']), restartPassword);
router.put("/premium/:uid", applyPolicy(['ADMIN', 'USER', 'USER_PREMIUM']), updateRole);
router.put("/:uid/documents", applyPolicy(['USER', 'USER_PREMIUM']), uploader.fields([ { name: 'profile', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }, { name: 'documents' }]), updateDocuments);
router.delete("/:uid", applyPolicy(['ADMIN', 'USER', 'USER_PREMIUM']), deleteUser);
router.delete("/", applyPolicy(['ADMIN']), deleteInactiveUsers);

export default router;