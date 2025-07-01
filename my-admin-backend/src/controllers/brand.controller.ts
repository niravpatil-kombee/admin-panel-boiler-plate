import { Request, Response } from 'express';
import Brand from '../models/Brand';
import { isValidObjectId } from 'mongoose';

export const createBrand = async (req: Request, res: Response) => {
    const brandData = {
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
    }
    try {
        const existingBrand = await Brand.findOne({ name: req.body.name });
        if (existingBrand) {
          return res.status(409).json({
            message: "Brand already exists with this name",
          });
        }

        const brand = new Brand(brandData);
        await brand.save();

        return res.status(201).json({
            message: "Brand created successfully",
            brand,
        }); 
    } catch (error: any) {
        res.status(500).json({
            message: "Error while creating brand",
            error: error.message,
          });
    }
};

export const getBrands = async (_req: Request, res: Response) => {
    try {
        const brands = await Brand.find().exec();
        res.status(200).json({
            message: "Brands fetched!",
            totalBrands: brands.length,
            brands,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching brands",
            error: error instanceof Error ? error.message : 'Unknown error',
          });
    }
};

export const getBrandById = async (req: Request, res: Response) => {
    const brandId = req.params.id;
    try {
        if (!isValidObjectId(brandId)) {
            return res.status(400).json({
              message: "brandId is not valid",
              Id: brandId,
            });
          }

        const brand = await Brand.findById(req.params.id).exec();
        if (!brand) {
            return res.status(404).json({
              message: "Brand not found",
            });
          }
        res.status(200).json({
            message: "Brand fetched!",
            brand,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching brand",
            error: error instanceof Error ? error.message : 'Unknown error',
          });
    }
};

export const updateBrand = async (req: Request, res: Response) => {
    const brandId = req.params.id;
    try {
        if (!isValidObjectId(brandId)) {
            return res.status(400).json({
              message: "brandId is not valid",
              Id: brandId,
            });
          }
        const brand = await Brand.findByIdAndUpdate(brandId, req.body, { new: true }).exec();
        if (!brand) {
            return res.status(404).json({
              message: "Brand not found",
            });
          }
        res.status(200).json({
            message: "Brand updated successfully",
            brand,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating brand",
            error: error instanceof Error ? error.message : 'Unknown error',
          });
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    const brandId = req.params.id;
    try {
        if (!isValidObjectId(brandId)) {
            return res.status(400).json({
              message: "brandId is not valid",
              Id: brandId,
            });
          }
        const brand = await Brand.findByIdAndDelete(brandId).exec();
        if (!brand) {
            return res.status(404).json({
              message: "Brand not found",
            });
          }
        res.status(200).json({
            message: "Brand deleted successfully",
            brand,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting brand",
            error: error instanceof Error ? error.message : 'Unknown error',
          });
    }
};