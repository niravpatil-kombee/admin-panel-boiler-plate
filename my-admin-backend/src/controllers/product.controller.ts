import { Request, Response } from "express";
import Product from "../models/Product";
import fs from "fs";
import slugify from "slugify";
import { isValidObjectId } from "mongoose";

const parseJsonString = (value: any) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const computeStockAvailable = (quantity: number): boolean => quantity > 0;

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = { ...req.body };

    if (!productData.title) {
      return res.status(400).json({ message: "Product title is required" });
    }

    if (!productData.slug) {
      productData.slug = slugify(productData.title, {
        lower: true,
        strict: true,
      });
    }

    const fieldsToParse = [
      "price",
      "inventory",
      "attributes",
      "tags",
      "variants",
    ];
    fieldsToParse.forEach((field) => {
      if (typeof productData[field] === "string") {
        productData[field] = parseJsonString(productData[field]);
      }
    });

    const files = req.files as Express.Multer.File[];

    // Handle main image
    const mainImageFile = files?.find((f) => f.fieldname === "mainImage");
    if (mainImageFile) {
      productData.mainImage = `/uploads/products/${mainImageFile.filename}`;
    } else {
      return res.status(400).json({ message: "Main image is required." });
    }

    // Handle variants and resolve image field references
    if (Array.isArray(productData.variants)) {
      productData.variants = productData.variants.map(
        (variant: any, index: number) => {
          if (typeof variant.price === "string")
            variant.price = parseJsonString(variant.price);
          if (typeof variant.inventory === "string")
            variant.inventory = parseJsonString(variant.inventory);
          if (typeof variant.attributes === "string")
            variant.attributes = parseJsonString(variant.attributes);

          if (Array.isArray(variant.images)) {
            variant.images = variant.images
              .map((fieldName: string) => {
                const file = files?.find((f) => f.fieldname === fieldName);
                return file ? `/uploads/products/${file.filename}` : null;
              })
              .filter((v: string | null) => v !== null);
          }

          variant.stockAvailable = computeStockAvailable(
            variant.inventory?.quantity || 0
          );
          return variant;
        }
      );
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err: any) {
    console.error("Error creating product:", err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: err.errors });
    }
    res
      .status(500)
      .json({ message: "Error while creating product", error: err.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().exec();
    res
      .status(200)
      .json({
        message: "Products fetched!",
        totalProducts: products.length,
        products,
      });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetch products",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const productId: string = req.params.id;
  try {
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .json({ message: "productId is not valid", Id: productId });
    }
    const product = await Product.findById(productId).exec();
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product fetched!", product });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetch product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  const productId = req.params.id;
  try {
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .json({ message: "productId is not valid", Id: productId });
    }

    const updateData = { ...req.body };
    const fieldsToParse = ["tags", "attributes", "variants"];
    fieldsToParse.forEach((field) => {
      if (typeof updateData[field] === "string") {
        updateData[field] = parseJsonString(updateData[field]);
      }
    });

    const files = req.files as Express.Multer.File[];

    // Handle main image
    const mainImageFile = files?.find((f) => f.fieldname === "mainImage");
    if (mainImageFile) {
      updateData.mainImage = `/uploads/products/${mainImageFile.filename}`;
    }

    // Handle variant images
    if (Array.isArray(updateData.variants)) {
      updateData.variants = updateData.variants.map(
        (variant: any, index: number) => {
          if (typeof variant.price === "string")
            variant.price = parseJsonString(variant.price);
          if (typeof variant.inventory === "string")
            variant.inventory = parseJsonString(variant.inventory);
          if (typeof variant.attributes === "string")
            variant.attributes = parseJsonString(variant.attributes);

          if (Array.isArray(variant.images)) {
            variant.images = variant.images
              .map((fieldName: string) => {
                const file = files?.find((f) => f.fieldname === fieldName);
                return file ? `/uploads/products/${file.filename}` : null;
              })
              .filter((v: string | null) => v !== null);
          }

          variant.stockAvailable = computeStockAvailable(
            variant.inventory?.quantity || 0
          );
          return variant;
        }
      );
    }

    console.log("Update data:", updateData);

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    }).exec();
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Product updated successfully", product });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || "An error occurred" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId: string = req.params.id;

  if (!isValidObjectId(productId)) {
    return res
      .status(400)
      .json({ message: "productId is not valid", Id: productId });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", Id: productId });
    }

    if (product.mainImage) {
      const filePath = `.${product.mainImage}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({
      message: "Error in delete Product",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
