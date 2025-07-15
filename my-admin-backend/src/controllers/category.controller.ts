import { Request, Response } from 'express';
import Category from '../models/Category';
import { isValidObjectId } from 'mongoose';
import { ICategory} from '../types/index'

export const createCategory = async (req: Request, res: Response) => {
  const categoryData: ICategory = {
    name: req.body.name,
    slug: req.body.slug,
    description: req.body.description,
  };

  // if (req.body.parent) {
  //   categoryData.parent = req.body.parent;
  // }

  try {
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(409).json({
        message: 'Category already exists with this name',
      });
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error while creating category',
      error: error.message,
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().exec();
    res.status(200).json({
      message: 'Categories fetched!',
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error while fetching categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  try {
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        message: 'categoryId is not valid',
        Id: categoryId,
      });
    }

    const category = await Category.findById(categoryId);
      // .populate('parent', '_id name')
      // .exec();

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.status(200).json({
      message: 'Category fetched!',
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error while fetching category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  try {
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        message: 'categoryId is not valid',
        Id: categoryId,
      });
    }

    const updateData: ICategory = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
    };

    //TODO:IT WILL REMOVE CATEGORY PARENT FROM HERE?
    // if (req.body.parent) {
    //   updateData.parent = req.body.parent;
    // }

    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(409).json({
        message: 'Category already exists with this name',
      });
    }
    

    const category = await Category.findByIdAndUpdate(categoryId, updateData, { new: true }).exec();

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error while updating category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  try {
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        message: 'categoryId is not valid',
        Id: categoryId,
      });
    }

    const category = await Category.findByIdAndDelete(categoryId).exec();

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.status(200).json({
      message: 'Category deleted successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error while deleting category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
