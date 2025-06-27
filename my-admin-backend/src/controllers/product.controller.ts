import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Parse JSON fields if sent as FormData
    const body = {
      ...req.body,
      price: req.body.price ? JSON.parse(req.body.price) : undefined,
      inventory: req.body.inventory ? JSON.parse(req.body.inventory) : undefined,
      attributes: req.body.attributes ? JSON.parse(req.body.attributes) : [],
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      images: req.file ? [{ url: `/uploads/products/${req.file.filename}` }] : [],
    };
    const product = await productService.createProduct(body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  const products = await productService.getProducts();
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await productService.deleteProduct(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(204).send();
};
