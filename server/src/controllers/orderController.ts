import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json(order);
  } catch {
    res.status(500).json({ error: "Failed to fetch order." });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { customer, items } = req.body;
  // customer: { name, email, phone, address }

  try {
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data." });
    }

    let existingCustomer = await prisma.customer.findUnique({
      where: { email: customer.email },
    });

    if (!existingCustomer) {
      existingCustomer = await prisma.customer.create({
        data: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        },
      });
    }

    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let orderTotal = 0;

    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found.`);
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.name}`);
      }

      const total = item.quantity * product.price;
      orderTotal += total;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        total,
      };
    });

    const order = await prisma.order.create({
      data: {
        customerId: existingCustomer.id,
        total: orderTotal,
        status: "Pending",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    // Deduct stock immediately
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    res.status(201).json(order);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ error: error.message || "Failed to create order." });
  }
};

export const processOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status !== "Pending")
      return res.status(400).json({ error: "Order already processed" });

    // Process each order item
    for (const item of order.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) throw new Error("Product not found");
      if (product.stockQuantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name} (requested: ${item.quantity}, available: ${product.stockQuantity})`
        );
      }

      // Deduct stock
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Update order status
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "Processed" },
    });

    res.json({ message: "Order processed", order: updated });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to process order." });
  }
};
