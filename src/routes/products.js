import { Router } from "express";
import { createProducts, deleteProduct, getProductById, getProducts, mocking, upgrateProduct } from "../controllers/products.js";
import { applyPolicy } from "../middlewares/auth.js";

const router = Router();

router.get("/", getProducts);
router.get("/mockingproducts", mocking);
router.get("/:pid", getProductById);
router.post("/", applyPolicy(['ADMIN', 'USER_PREMIUM']), createProducts);
router.put("/:pid", applyPolicy(['ADMIN', 'USER_PREMIUM']), upgrateProduct);
router.delete("/:pid", applyPolicy(['ADMIN', 'USER_PREMIUM']), deleteProduct);

export default router;