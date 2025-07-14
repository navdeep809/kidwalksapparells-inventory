import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

// Total sales and revenue
export const getSalesSummary = async (_req: Request, res: Response) => {
  try {
    const totalSales = await prisma.order.aggregate({
      _sum: { total: true },
      _count: true,
    });

    const recentSales = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    res.json({
      totalRevenue: totalSales._sum.total || 0,
      totalOrders: totalSales._count,
      recentSales,
    });
  } catch {
    res.status(500).json({ error: "Failed to get sales summary." });
  }
};

// Total purchases
export const getPurchaseSummary = async (_req: Request, res: Response) => {
  try {
    const totalPurchase = await prisma.purchase.aggregate({
      _sum: { totalCost: true },
      _count: true,
    });

    res.json({
      totalPurchaseCost: totalPurchase._sum.totalCost || 0,
      totalPurchases: totalPurchase._count,
    });
  } catch {
    res.status(500).json({ error: "Failed to get purchase summary." });
  }
};

// Most sold products
export const getPopularProducts = async (_req: Request, res: Response) => {
  try {
    const popular = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const productIds = popular.map((p) => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const result = popular.map((p) => ({
      product: products.find((prod) => prod.id === p.productId),
      sold: p._sum.quantity || 0,
    }));

    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to get popular products." });
  }
};

// Order summary (pending, processed, etc.)
export const getOrderSummary = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.order.count();
    const pending = await prisma.order.count({ where: { status: "Pending" } });
    const processed = await prisma.order.count({
      where: { status: "Processed" },
    });

    res.json({ total, pending, processed });
  } catch {
    res.status(500).json({ error: "Failed to get order summary." });
  }
};

// Customer growth (last 7/30 days)
export const getCustomerGrowth = async (_req: Request, res: Response) => {
  try {
    const last7Days = await prisma.customer.count({
      where: { createdAt: { gte: dayjs().subtract(7, "day").toDate() } },
    });

    const last30Days = await prisma.customer.count({
      where: { createdAt: { gte: dayjs().subtract(30, "day").toDate() } },
    });

    const total = await prisma.customer.count();

    res.json({ total, last7Days, last30Days });
  } catch {
    res.status(500).json({ error: "Failed to get customer growth data." });
  }
};

// Expenses summary
export const getExpenseSummary = async (_req: Request, res: Response) => {
  try {
    const byCategory = await prisma.expense.groupBy({
      by: ["category"],
      _sum: { amount: true },
    });

    const total = await prisma.expense.aggregate({
      _sum: { amount: true },
    });

    res.json({ total: total._sum.amount || 0, breakdown: byCategory });
  } catch {
    res.status(500).json({ error: "Failed to get expense summary." });
  }
};
