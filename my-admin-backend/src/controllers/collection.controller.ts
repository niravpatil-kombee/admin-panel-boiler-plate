import { Request, Response } from 'express';
import * as collectionService from '../services/collection.service';

export const createCollection = async (req: Request, res: Response) => {
    try {
        const collection = await collectionService.createCollection(req.body);
        res.status(201).json(collection);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getCollections = async (req: Request, res: Response) => {
    const collections = await collectionService.getCollections();
    res.status(200).json(collections);
};

export const getCollectionById = async (req: Request, res: Response) => {
    const collection = await collectionService.getCollectionById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.status(200).json(collection);
};

export const updateCollection = async (req: Request, res: Response) => {
    const collection = await collectionService.updateCollection(req.params.id, req.body);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.status(200).json(collection);
};

export const deleteCollection = async (req: Request, res: Response) => {
    const collection = await collectionService.deleteCollection(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    res.status(204).send();
};
