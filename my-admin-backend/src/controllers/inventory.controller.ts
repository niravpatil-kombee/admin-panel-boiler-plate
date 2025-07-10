import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import { isValidObjectId } from 'mongoose';
import { IInventory } from '../types';

export const createInventory = async (req: Request, res: Response) => {
  const inventoryData: IInventory = req.body;
  try {
    // Check for duplicate SKU
    const existing = await Inventory.findOne({ sku: inventoryData.sku });
    if (existing) {
      return res.status(409).json({ message: 'Inventory already exists with this SKU' });
    }
    const inventory = new Inventory(inventoryData);
    await inventory.save();
    await inventory.populate('warehouse');
    res.status(201).json({ message: 'Inventory created successfully', inventory });
  } catch (error: any) {
    res.status(500).json({ message: 'Error while creating inventory', error: error.message });
  }
};

export const getInventories = async (_req: Request, res: Response) => {
  try {
    const inventories = await Inventory.find().populate('warehouse').exec();
    res.status(200).json({ message: 'Inventories fetched!', total: inventories.length, inventories });
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching inventories', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getInventoryById = async (req: Request, res: Response) => {
  const inventoryId = req.params.id;
  try {
    if (!isValidObjectId(inventoryId)) {
      return res.status(400).json({ message: 'inventoryId is not valid', id: inventoryId });
    }
    const inventory = await Inventory.findById(inventoryId).populate('warehouse').exec();
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.status(200).json({ message: 'Inventory fetched!', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching inventory', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  const inventoryId = req.params.id;
  try {
    if (!isValidObjectId(inventoryId)) {
      return res.status(400).json({ message: 'inventoryId is not valid', id: inventoryId });
    }
    const updateData: IInventory = req.body;
    const existing = await Inventory.findOne({ sku: updateData.sku });
    if (existing && (existing as any)._id.toString() !== inventoryId) {
      return res.status(409).json({ message: 'Inventory already exists with this SKU' });
    }
    const inventory = await Inventory.findByIdAndUpdate(inventoryId, updateData, { new: true }).populate('warehouse').exec();
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.status(200).json({ message: 'Inventory updated successfully', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error while updating inventory', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteInventory = async (req: Request, res: Response) => {
  const inventoryId = req.params.id;
  try {
    if (!isValidObjectId(inventoryId)) {
      return res.status(400).json({ message: 'inventoryId is not valid', id: inventoryId });
    }
    const inventory = await Inventory.findByIdAndDelete(inventoryId).populate('warehouse').exec();
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    res.status(200).json({ message: 'Inventory deleted successfully', inventory });
  } catch (error) {
    res.status(500).json({ message: 'Error while deleting inventory', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 