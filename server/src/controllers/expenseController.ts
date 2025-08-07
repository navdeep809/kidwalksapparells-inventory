import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getExpenses = async (_req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { timestamp: "desc" },
    });
    res.json(expenses);
  } catch {
    res.status(500).json({ error: "Failed to fetch expenses." });
  }
};

export const getExpense = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) return res.status(404).json({ error: "Expense not found." });

    res.json(expense);
  } catch {
    res.status(500).json({ error: "Failed to fetch expense." });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  const { category, amount, note, timestamp } = req.body;

  try {
    const parsedTimestamp = new Date(timestamp);

    if (isNaN(parsedTimestamp.getTime())) {
      return res
        .status(400)
        .json({ error: "Invalid date format for timestamp." });
    }

    const expense = await prisma.expense.create({
      data: {
        category,
        amount,
        note,
        timestamp: parsedTimestamp,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: "Failed to create expense." });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.expense.delete({
      where: { id },
    });

    res.json({ message: "Expense deleted successfully." });
  } catch {
    res.status(400).json({ error: "Failed to delete expense." });
  }
};
