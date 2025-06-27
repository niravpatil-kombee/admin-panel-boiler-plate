import { Request, Response } from 'express';
import * as brandService from '../services/brand.service';

export const createBrand = async (req: Request, res: Response) => {
    try {
        const brand = await brandService.createBrand(req.body);
        res.status(201).json(brand);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getBrands = async (_req: Request, res: Response) => {
    const brands = await brandService.getBrands();
    res.status(200).json(brands);
};

export const getBrandById = async (req: Request, res: Response) => {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.status(200).json(brand);
};

export const updateBrand = async (req: Request, res: Response) => {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.status(200).json(brand);
};

export const deleteBrand = async (req: Request, res: Response) => {
    const brand = await brandService.deleteBrand(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.status(204).send();
};
