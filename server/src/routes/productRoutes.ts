import express from "express";
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { upload } from "../middlewares/multer";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", requireAuth, getProducts);
router.get("/:productId", requireAuth, getProduct);
router.post("/", requireAuth, upload.single("image"), createProduct);
router.put("/:productId", requireAuth, upload.single("image"), updateProduct);
router.delete("/:productId", requireAuth, deleteProduct);

export default router;
