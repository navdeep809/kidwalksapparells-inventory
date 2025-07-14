import express from "express";
import {
  getSalesSummary,
  getPurchaseSummary,
  getPopularProducts,
  getOrderSummary,
  getCustomerGrowth,
  getExpenseSummary,
} from "../controllers/statisticsController";

import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/sales-summary", requireAuth, getSalesSummary);
router.get("/purchase-summary", requireAuth, getPurchaseSummary);
router.get("/popular-products", requireAuth, getPopularProducts);
router.get("/order-summary", requireAuth, getOrderSummary);
router.get("/customer-growth", requireAuth, getCustomerGrowth);
router.get("/expense-summary", requireAuth, getExpenseSummary);

export default router;
