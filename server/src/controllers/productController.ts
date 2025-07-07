import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const product = await prisma.products.findUnique({
      where: {
        productId: productId,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product" });
  }
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity, imageUrl } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
        imageUrl,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (
  req: Request, 
  res: Response
): Promise<void> => {    
  try{
    const { productId, name, price, rating, stockQuantity, imageUrl } = req.body;
    const product = await prisma.products.update({
      where: { productId : productId },
      data: {
        productId: productId,
        name: name,
        price: price,
        rating: rating,
        stockQuantity, 
        imageUrl: imageUrl
      }
    })
  }catch(error){
      res.status(500).json({ message: "Error updating product" });
  }
};