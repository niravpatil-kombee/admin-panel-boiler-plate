import { Request, Response } from 'express';
import Product from '../models/Product';
import fs from 'fs';
import slugify from 'slugify';
import { isValidObjectId } from 'mongoose';

const parseJsonString = (value: any) => {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = { ...req.body };

        console.log(productData);

        if (!productData.name) {
            return res.status(400).json({ message: 'Product name is required' });
        }

        if (!productData.slug) {
            productData.slug = slugify(productData.name, { lower: true, strict: true });
        }

        const fieldsToParse = ['price', 'inventory', 'attributes', 'tags', 'variants'];
        fieldsToParse.forEach(field => {
            if (productData[field] && typeof productData[field] === 'string') {
                productData[field] = parseJsonString(productData[field]);
            }
        });

        // Handle price if it is sent as a single number
        if (productData.price && typeof productData.price === 'number') {
            productData.price = { base: productData.price };
        }

        productData.images = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            productData.images = req.files.map((file: any) => ({
                url: `/uploads/products/${file.filename}`,
            }));
        } else if (req.file) {
            productData.images.push({ url: `/uploads/products/${req.file.filename}` });
        }
        
        const newProduct = await productService.createProduct(productData);

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });
    } catch (err: any) {
        console.error('Error creating product:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: err.errors });
        }
        res.status(500).json({
            message: 'Error while creating product',
            error: err.message,
        });
    }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().exec();
    res.status(200).json({
      message: "Products fetched!",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetch products",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const productId: string = req.params.id;
  try {
    const product = await Product.findById(productId).exec();
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product fetched!",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetch product",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Ensure that if a new file is uploaded, it gets added to the images array.
    // This logic might need to be more sophisticated, e.g., replacing existing images.
    const updateData = { ...req.body };
    if (req.file) {
      updateData.images = [{ url: `/uploads/products/${req.file.filename}` }];
    }

    const product = await productService.updateProduct(req.params.id, updateData);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'An error occurred' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId: string = req.params.id;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({
      message: "userId is not valid",
      Id: productId,
    });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({
        message: "product not found with this id",
        Id: productId,
      });
    }

    // Remove image from ImageUploads folder once its particular product deleted
    if (product.images) {
      const oldImagePath = product.images.url.replace('upload/', '');
      const fullPath = `ImageUploads/${oldImagePath}`;

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in delete Product",
      error,
    });
  }
};
