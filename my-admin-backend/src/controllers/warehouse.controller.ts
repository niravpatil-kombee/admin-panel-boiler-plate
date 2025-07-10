import { Request, Response } from 'express';
import Warehouse from '../models/Warehouse';
import { isValidObjectId } from 'mongoose';
import { IWarehouse } from '../types';

export const createWarehouse = async (req: Request, res: Response) => {
  const warehouseData: IWarehouse = req.body;
  try {
    // Check for duplicate code
    const existing = await Warehouse.findOne({ code: warehouseData.code });
    if (existing) {
      return res.status(409).json({ message: 'Warehouse already exists with this code' });
    }
    const warehouse = new Warehouse(warehouseData);
    await warehouse.save();
    res.status(201).json({ message: 'Warehouse created successfully', warehouse });
  } catch (error: any) {
    res.status(500).json({ message: 'Error while creating warehouse', error: error.message });
  }
};

export const getWarehouses = async (_req: Request, res: Response) => {
  try {
    const warehouses = await Warehouse.find().exec();
    res.status(200).json({ message: 'Warehouses fetched!', total: warehouses.length, warehouses });
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching warehouses', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getWarehouseById = async (req: Request, res: Response) => {
  const warehouseId = req.params.id;
  try {
    if (!isValidObjectId(warehouseId)) {
      return res.status(400).json({ message: 'warehouseId is not valid', id: warehouseId });
    }
    const warehouse = await Warehouse.findById(warehouseId).exec();
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json({ message: 'Warehouse fetched!', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching warehouse', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateWarehouse = async (req: Request, res: Response) => {
  const warehouseId = req.params.id;
  try {
    if (!isValidObjectId(warehouseId)) {
      return res.status(400).json({ message: 'warehouseId is not valid', id: warehouseId });
    }
    const updateData: IWarehouse = req.body;
    const existing = await Warehouse.findOne({ code: updateData.code });
    if (existing && (existing as any)._id.toString() !== warehouseId) {
      return res.status(409).json({ message: 'Warehouse already exists with this code' });
    }
    const warehouse = await Warehouse.findByIdAndUpdate(warehouseId, updateData, { new: true }).exec();
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json({ message: 'Warehouse updated successfully', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Error while updating warehouse', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  const warehouseId = req.params.id;
  try {
    if (!isValidObjectId(warehouseId)) {
      return res.status(400).json({ message: 'warehouseId is not valid', id: warehouseId });
    }
    const warehouse = await Warehouse.findByIdAndDelete(warehouseId).exec();
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json({ message: 'Warehouse deleted successfully', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Error while deleting warehouse', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 