import express from "express";
import {
  getCustomers,
  getCustomer,
  deleteCustomer,
} from "../controllers/customerController";
import { requireAuth } from "../middlewares/requireAuth";
import { isAdmin } from "../middlewares/auth";

const router = express.Router();

router.get("/", requireAuth, getCustomers); // View all customers
router.get("/:id", requireAuth, getCustomer); // View single customer
router.delete("/:id", requireAuth, isAdmin, deleteCustomer); // Admin only

export default router;
