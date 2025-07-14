import express from "express";

import { requireAuth } from "../middlewares/requireAuth";
import { isAdmin } from "../middlewares/auth";
import {
  createPurchase,
  deletePurchase,
  getPurchase,
  getPurchases,
} from "../controllers/purchaseController";

const router = express.Router();

router.get("/", requireAuth, getPurchases);
router.get("/:id", requireAuth, getPurchase);
router.post("/", requireAuth, isAdmin, createPurchase);
router.delete("/:id", requireAuth, isAdmin, deletePurchase);

export default router;
