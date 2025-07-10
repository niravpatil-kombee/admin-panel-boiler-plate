import { Request, Response } from 'express';
import Collection from '../models/Collection';
import { isValidObjectId } from 'mongoose';

export const createCollection = async (req: Request, res: Response) => {
    const collectionData = {
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
    }
    try {
        const existingBrand = await Collection.findOne({ name: req.body.name });
        if (existingBrand) {
          return res.status(409).json({
            message: "Category already exists with this name",
          });
        }

        const collection = new Collection(collectionData);
        await collection.save();

        return res.status(201).json({
            message: "Collection created successfully",
            collection,
        }); 
    } catch (error: any) {
        res.status(500).json({
            message: "Error while creating collection",
            error: error.message,
          });
    }
};


export const getCollections = async (_req: Request, res: Response) => {
    try {
        const collections = await Collection.find().exec();
        res.status(200).json({
            message: "Collections fetched!",
            totalBrands: collections.length,
            collections,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching collections",
            error: error instanceof Error ? error.message : 'Unknown error',
          });
    }
};


export const getCollectionById = async (req: Request, res: Response) => {
    const collectionId = req.params.id;
    try {
        if (!isValidObjectId(collectionId)) {
            return res.status(400).json({
              message: "collectionId is not valid",
              Id: collectionId,
            });
          }

        const collection = await Collection.findById(req.params.id).exec();
        if (!collection) {
            return res.status(404).json({
              message: "Collection not found",
            });
          }
        res.status(200).json({
            message: "Collection fetched!",
            collection,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching collection",
            error: error instanceof Error ? error.message : 'Unknown error',
          });
    }
};


export const updateCollection = async (req: Request, res: Response) => {
    const collectionId = req.params.id;
    const updateData = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
    };
    try {
        if (!isValidObjectId(collectionId)) {
            return res.status(400).json({
              message: "collectionId is not valid",
              Id: collectionId,
            });
          }

          const existingcollection = await Collection.findOne({ name: req.body.name });
          if (existingcollection) {
            return res.status(409).json({
              message: "Collection already exists with this name",
            });
          }
            
        const collection = await Collection.findByIdAndUpdate(collectionId, updateData, { new: true }).exec();
        if (!collection) {
            return res.status(404).json({
              message: "Collection not found",
            });
          }
        res.status(200).json({
            message: "Collection updated successfully",
            collection,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating collection",
            error: error instanceof Error ? error.message : 'Unknown error',
          });
    }
};

export const deleteCollection = async (req: Request, res: Response) => {
    const collectionId = req.params.id;
    try {
        if (!isValidObjectId(collectionId)) {
            return res.status(400).json({
              message: "brandId is not valid",
              Id: collectionId,
            });
          }
        const collection = await Collection.findByIdAndDelete(collectionId).exec();
        if (!collection) {
            return res.status(404).json({
              message: "Collection not found",
            });
          }
        res.status(200).json({
            message: "collection deleted successfully",
            collection,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting collection",
            error: error instanceof Error ? error.message : 'Unknown error',
          });
    }
};
