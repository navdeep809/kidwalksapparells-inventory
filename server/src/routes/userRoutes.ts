import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
} from "../controllers/userController";
import { isAdmin } from "../middlewares/auth";
import { requireAuth } from "../middlewares/requireAuth";

const router = express.Router();

router.get("/", requireAuth, getUsers);
router.get("/:userId", requireAuth, getUser);
router.post("/", requireAuth, isAdmin, createUser); // 🔐 Only Admin
router.put("/:userId", requireAuth, isAdmin, updateUser); // 🔐 Only Admin

export default router;
