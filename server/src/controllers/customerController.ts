import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    res.json(
      customers.map((customer) => ({
        ...customer,
        totalOrders: customer._count.orders,
      }))
    );
  } catch {
    res.status(500).json({ error: "Failed to fetch customers." });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                product: {
                  select: {
                    name: true,
                    price: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!customer || customer.isDeleted) {
      return res.status(404).json({ error: "Customer not found." });
    }

    res.json(customer);
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    res.status(500).json({ error: "Failed to fetch customer." });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({ message: "Customer deleted (soft).", customer });
  } catch {
    res.status(400).json({ error: "Failed to delete customer." });
  }
};
