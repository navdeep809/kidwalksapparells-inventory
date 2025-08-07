import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  processOrder,
} from "../controllers/orderController";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", requireAuth, getOrders); // GET all orders
router.get("/:orderId", requireAuth, getOrder); // GET single order
router.post("/", requireAuth, createOrder); // POST create order
router.post("/process/:orderId", requireAuth, processOrder);

export default router;
