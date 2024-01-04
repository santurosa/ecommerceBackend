import { Router } from "express";
import { getCart, createCart, upgrateCart, upgrateCartByBody, updateQuantityProducts, deleteProductToCart, purchase, getTicketsByEmail, emptyCart } from "../controllers/carts.js";
import { applyPolicy } from "../middlewares/auth.js";

const router = Router();

router.get("/tickets", applyPolicy(['ADMIN', 'USER', 'USER_PREMIUM']), getTicketsByEmail);
router.get("/:cid", applyPolicy(['PUBLIC']), getCart);
router.post("/", applyPolicy(['PUBLIC']), createCart);
router.put("/:cid/product/:pid", applyPolicy(['USER', 'USER_PREMIUM']), upgrateCart);
router.put("/:cid", applyPolicy(['USER', 'USER_PREMIUM']), upgrateCartByBody);
router.put("/:cid/products/:pid", applyPolicy(['USER', 'USER_PREMIUM']), updateQuantityProducts);
router.delete("/:cid", emptyCart);
router.delete("/:cid/product/:pid", deleteProductToCart);
router.post("/:cid/purchase", applyPolicy(['USER', 'USER_PREMIUM']), purchase);

export default router;