import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all purchases
export const getPurchases = async (_req: Request, res: Response) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: { product: true },
      orderBy: { timestamp: "desc" },
    });

    res.json(purchases);
  } catch (error) {
    console.error("[getPurchases]", error);
    res.status(500).json({ error: "Failed to fetch purchases." });
  }
};

// Get a specific purchase by ID
export const getPurchase = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found." });
    }

    res.json(purchase);
  } catch (error) {
    console.error("[getPurchase]", error);
    res.status(500).json({ error: "Failed to fetch purchase." });
  }
};

// Create a new purchase
export const createPurchase = async (req: Request, res: Response) => {
  const { productId, quantity, unitCost, note } = req.body;

  if (!productId || !quantity || !unitCost) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    const totalCost = quantity * unitCost;

    const purchase = await prisma.purchase.create({
      data: {
        productId,
        quantity,
        unitCost,
        totalCost,
        note,
      },
      include: { product: true }, // Include product in response
    });

    // Update stock
    await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: {
          increment: quantity,
        },
      },
    });

    res.status(201).json(purchase);
  } catch (error: any) {
    console.error("[createPurchase]", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to create purchase." });
  }
};

// Delete a purchase and reverse stock
export const deletePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const purchase = await prisma.purchase.findUnique({ where: { id } });

    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found." });
    }

    // Delete the purchase
    await prisma.purchase.delete({ where: { id } });

    // Roll back stock
    await prisma.product.update({
      where: { id: purchase.productId },
      data: {
        stockQuantity: {
          decrement: purchase.quantity,
        },
      },
    });

    res.json({ message: "Purchase deleted and stock updated." });
  } catch (error) {
    console.error("[deletePurchase]", error);
    res.status(400).json({ error: "Failed to delete purchase." });
  }
};
