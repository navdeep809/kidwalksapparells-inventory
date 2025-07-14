import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch user." });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Email already exists." });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashed,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Failed to create user." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role },
    });

    res.json(user);
  } catch {
    res.status(400).json({ error: "Failed to update user." });
  }
};
