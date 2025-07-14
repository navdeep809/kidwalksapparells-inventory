import express from "express";
import {
  getExpenses,
  getExpense,
  createExpense,
  deleteExpense,
} from "../controllers/expenseController";
import { requireAuth } from "../middlewares/requireAuth";
import { isAdmin } from "../middlewares/auth";

const router = express.Router();

router.get("/", requireAuth, getExpenses);
router.get("/:id", requireAuth, getExpense);
router.post("/", requireAuth, isAdmin, createExpense);
router.delete("/:id", requireAuth, isAdmin, deleteExpense);

export default router;
