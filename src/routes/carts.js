import { Router } from "express";
import { getCart, createCart, upgrateCart, upgrateCartByBody, updateQuantityProducts, deleteCart, deleteProductToCart, purchase } from "../controllers/carts.js";
import { applyPolicy } from "../middlewares/auth.js";

const router = Router();


router.get("/:cid", getCart);
router.post("/", createCart);
router.put("/:cid/product/:pid", applyPolicy(['USER', 'USER_PREMIUM']), upgrateCart);
router.put("/:cid", applyPolicy(['USER', 'USER_PREMIUM']), upgrateCartByBody);
router.put("/:cid/products/:pid", applyPolicy(['USER', 'USER_PREMIUM']), updateQuantityProducts);
router.delete("/:cid", deleteCart);
router.delete("/:cid/product/:pid", deleteProductToCart);
router.post("/:cid/purchase", applyPolicy(['USER', 'USER_PREMIUM']), purchase);

export default router;