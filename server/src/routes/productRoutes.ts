import { Router } from "express";
import { createProduct, getProducts, getProduct, updateProduct } from "../controllers/productController";

const router = Router();

router.get("/:productId", getProduct);
router.get("/", getProducts);
router.post("/", createProduct);
router.patch("/", updateProduct);

export default router;
