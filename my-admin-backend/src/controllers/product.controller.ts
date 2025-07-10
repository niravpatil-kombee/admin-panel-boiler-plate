import { Request, Response } from 'express';
import Product from '../models/Product';
import { isValidObjectId } from 'mongoose';
import { uploadProductImage } from '../middlewares/upload.middleware';

// Map uploaded files to fieldname -> path
const extractFilesMap = (files: Express.Multer.File[]) => {
  return files.reduce((acc, file) => {
    acc[file.fieldname] = file.path;
    return acc;
  }, {} as Record<string, string>);
};

const parseJson = (field: string | undefined) => {
  try {
    return field ? JSON.parse(field) : [];
  } catch {
    return [];
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const filesMap = extractFilesMap(req.files as Express.Multer.File[]);

    const {
      name,
      slug,
      description,
      brand,
      category,
      tags,
      isPublished,
      productAttributes,
      variants,
    } = req.body;

    const parsedProductAttributes = parseJson(productAttributes).map((attr: any) => {
      let value = attr.value;
      let fileUrl = undefined;
      if (attr.inputType === 'file' && attr.fileKey && filesMap[attr.fileKey]) {
        value = filesMap[attr.fileKey];
        fileUrl = filesMap[attr.fileKey];
      }
      return {
        attributeId: attr.attributeId || undefined,
        value,
        fileUrl,
      };
    });

    const parsedVariants = parseJson(variants).map((variant: any, idx: number) => ({
      name: variant.name,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      images: (variant.images || []).map((key: string) => filesMap[key] || key).filter(Boolean),
      inventory: variant.inventory,
      attributes: (variant.attributes || []).map((attr: any) => {
        let value = attr.value;
        let fileUrl = undefined;
        if (attr.inputType === 'file' && attr.fileKey && filesMap[attr.fileKey]) {
          value = filesMap[attr.fileKey];
          fileUrl = filesMap[attr.fileKey];
        }
        return {
          attributeId: attr.attributeId || undefined,
          value,
          fileUrl,
        };
      }),
    }));

    const product = await Product.create({
      name,
      slug,
      description,
      brand,
      category,
      tags: parseJson(tags),
      isPublished: isPublished === 'true',
      productAttributes: parsedProductAttributes,
      variants: parsedVariants,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('brand category variants.attributes.attributeId productAttributes.attributeId');
    res.status(200).json({ message: 'Products fetched', total: products.length, products });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid product ID' });

  try {
    const product = await Product.findById(id).populate('brand category variants.attributes.attributeId productAttributes.attributeId');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product fetched', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid product ID' });

  try {
    const filesMap = extractFilesMap(req.files as Express.Multer.File[]);
    const {
      name,
      slug,
      description,
      brand,
      category,
      tags,
      isPublished,
      productAttributes,
      variants,
    } = req.body;

    const parsedProductAttributes = parseJson(productAttributes).map((attr: any) => {
      let value = attr.value;
      let fileUrl = undefined;
      if (attr.inputType === 'file' && attr.fileKey && filesMap[attr.fileKey]) {
        value = filesMap[attr.fileKey];
        fileUrl = filesMap[attr.fileKey];
      }
      return {
        attributeId: attr.attributeId || undefined,
        value,
        fileUrl,
      };
    });

    const parsedVariants = parseJson(variants).map((variant: any) => ({
      name: variant.name,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      images: (variant.imageKeys || []).map((key: string) => filesMap[key]).filter(Boolean),
      inventory: variant.inventory,
      attributes: variant.attributes.map((attr: any) => ({
        attributeId: attr.attributeId,
        value: attr.value,
        fileUrl: attr.inputType === 'file' && attr.fileKey ? filesMap[attr.fileKey] : undefined,
      })),
    }));

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        brand,
        category,
        tags: parseJson(tags),
        isPublished: isPublished === 'true',
        productAttributes: parsedProductAttributes,
        variants: parsedVariants,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated', product: updated });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};



export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid product ID' });

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted', product: deleted });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
