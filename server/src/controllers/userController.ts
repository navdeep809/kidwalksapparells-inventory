import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try{
    let userld  = req.params.userId;
    const user = await prisma.users.findUnique({
      where: {userId : userld},
    })
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, name, email, role } = req.body;
    const product = await prisma.users.create({
      data: {
        userId,
        name,
        email,
        role,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (
  req: Request, 
  res: Response): Promise<void> => {
  try {
    const { userId, name, email, role } = req.body;
    const product = await prisma.users.update({
      where: { userId: userId},
      data: {
        name,
        email,
        role,
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};
