import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getCategories = async (_req: Request, res: Response) => {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
    const category = await categoryService.deleteCategory(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(204).send();
};
