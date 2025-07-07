import { Router } from "express";
import { getUsers, getUser, createUser, updateUser } from "../controllers/userController";

const router = Router();

router.get("/:userId", getUser);

router.get("/", getUsers);

router.post("/", createUser);

router.patch("/", updateUser);

export default router;
