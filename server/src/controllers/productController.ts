import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3";

const prisma = new PrismaClient();

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product." });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, sku, price, stockQuantity, category, description } = req.body;

    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) return res.status(409).json({ error: "SKU already exists." });

    let imageUrl: string | null = null;

    console.log("File buffer length:", req.file?.buffer?.length);

    if (req.file && req.file.buffer?.length > 0) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        category,
        description,
        imageUrl,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error uploading or saving product:", error);
    res.status(500).json({ error: "Failed to create product." });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { name, sku, price, stockQuantity, category, description } = req.body;

    let imageUrl: string | undefined;

    // Upload to S3 if image was passed
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));
      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existing) return res.status(404).json({ error: "Product not found." });

    // Update
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        sku,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        category,
        description,
        ...(imageUrl && { imageUrl }),
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(400).json({ error: "Failed to update product." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Product not found." });
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true }, // Soft delete
    });

    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(400).json({ error: "Failed to delete product." });
  }
};
