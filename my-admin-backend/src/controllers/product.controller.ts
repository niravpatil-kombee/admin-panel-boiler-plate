import { Request, Response } from "express";
import Product from "../models/Product";
import { isValidObjectId } from "mongoose";
import { uploadProductImage } from "../middlewares/upload.middleware";
import Inventory from "../models/Inventory";
import fs from "fs";
import path from "path";

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

    const parsedProductAttributes = parseJson(productAttributes).map(
      (attr: any) => {
        let value = attr.value;
        let fileUrl = undefined;
        if (
          attr.inputType === "file" &&
          attr.fileKey &&
          filesMap[attr.fileKey]
        ) {
          value = filesMap[attr.fileKey];
          fileUrl = filesMap[attr.fileKey];
        }
        return {
          attributeId: attr.attributeId || undefined,
          value,
          fileUrl,
        };
      }
    );

    // Create inventory docs for each variant and link by ObjectId
    const parsedVariants = parseJson(variants).map((variant: any) => {
      return {
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        images: (variant.images || [])
          .map((key: string) => filesMap[key] || key)
          .filter(Boolean),
        inventory: variant.inventory, // Use the inventory ObjectId string directly
        attributes: (variant.attributes || []).map((attr: any) => {
          let value = attr.value;
          let fileUrl = undefined;
          if (
            attr.inputType === "file" &&
            attr.fileKey &&
            filesMap[attr.fileKey]
          ) {
            value = filesMap[attr.fileKey];
            fileUrl = filesMap[attr.fileKey];
          }
          return {
            attributeId: attr.attributeId || undefined,
            value,
            fileUrl,
          };
        }),
      };
    });

    const product = await Product.create({
      name,
      slug,
      description,
      brand,
      category,
      tags: parseJson(tags),
      isPublished: isPublished === "true",
      productAttributes: parsedProductAttributes,
      variants: parsedVariants,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate(
      "brand category variants.attributes.attributeId productAttributes.attributeId"
    );
    res
      .status(200)
      .json({ message: "Products fetched", total: products.length, products });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid product ID" });

  try {
    const product = await Product.findById(id).populate(
      "brand category variants.attributes.attributeId productAttributes.attributeId"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product fetched", product });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid product ID" });

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

    const parsedProductAttributes = parseJson(productAttributes).map(
      (attr: any) => {
        let value = attr.value;
        let fileUrl = undefined;
        if (
          attr.inputType === "file" &&
          attr.fileKey &&
          filesMap[attr.fileKey]
        ) {
          value = filesMap[attr.fileKey];
          fileUrl = filesMap[attr.fileKey];
        }
        return {
          attributeId: attr.attributeId || undefined,
          value,
          fileUrl,
        };
      }
    );

    // Update or create inventory docs for each variant and link by ObjectId
    const parsedVariants = parseJson(variants).map((variant: any) => {
      return {
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        images: (variant.images || [])
          .map((key: string) => filesMap[key] || key)
          .filter(Boolean),
        inventory: variant.inventory, // Use the inventory ObjectId string directly
        attributes: (variant.attributes || []).map((attr: any) => {
          let value = attr.value;
          let fileUrl = undefined;
          if (
            attr.inputType === "file" &&
            attr.fileKey &&
            filesMap[attr.fileKey]
          ) {
            value = filesMap[attr.fileKey];
            fileUrl = filesMap[attr.fileKey];
          }
          return {
            attributeId: attr.attributeId || undefined,
            value,
            fileUrl,
          };
        }),
      };
    });

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        brand,
        category,
        tags: parseJson(tags),
        isPublished: isPublished === "true",
        productAttributes: parsedProductAttributes,
        variants: parsedVariants,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product updated", product: updated });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid product ID" });

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    // Remove product-level file attributes
    if (Array.isArray(deleted.productAttributes)) {
      for (const attr of deleted.productAttributes) {
        if (attr.fileUrl) {
          try {
            fs.unlinkSync(path.resolve(attr.fileUrl));
          } catch (e) {}
        }
      }
    }

    // Remove variant images
    if (Array.isArray(deleted.variants)) {
      for (const variant of deleted.variants) {
        if (Array.isArray(variant.images)) {
          for (const img of variant.images) {
            if (typeof img === "string" && img.startsWith("uploads/")) {
              try {
                fs.unlinkSync(path.resolve(img));
              } catch (e) {}
            }
          }
        }
        // Remove variant attribute file images
        if (Array.isArray(variant.attributes)) {
          for (const attr of variant.attributes) {
            if (attr.fileUrl) {
              try {
                fs.unlinkSync(path.resolve(attr.fileUrl));
              } catch (e) {}
            }
          }
        }
      }
    }

    res.status(200).json({ message: "Product deleted", product: deleted });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};
