import { Request, Response } from 'express';
import * as productService from '../services/product.service';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const create = async (req: MulterRequest, res: Response) => {
  try {
    const data = req.body;
    if (req.file) {
      data.image = req.file.filename; // Store image filename
    }
    const product = await productService.createProduct(data);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const products = await productService.getProducts();
  res.status(200).json(products);
};

export const getOne = async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json(product);
};

export const update = async (req: MulterRequest, res: Response) => {
  const data = req.body;
  if (req.file) {
    data.image = req.file.filename;
  }
  const product = await productService.updateProduct(req.params.id, data);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(200).json(product);
};

export const remove = async (req: Request, res: Response) => {
  const product = await productService.deleteProduct(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.status(204).send();
};
