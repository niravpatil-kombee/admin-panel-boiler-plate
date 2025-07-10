import { Request, Response } from "express";
import Attribute from "../models/Attributes";
import { isValidObjectId } from "mongoose";

export const createAttribute = async (req: Request, res: Response) => {
    try {
      const {
        name,
        slug,
        inputType,
        isRequired,
        isVariantLevel,
      } = req.body;
  
      const rawOptions = req.body.options;
      let options =
        inputType === 'dropdown' || inputType === 'multi-select'
          ? Array.isArray(rawOptions)
            ? rawOptions
            : rawOptions
              ? [rawOptions]
              : []
          : [];
  
      if (inputType === 'file' && req.file) {
        options.push(req.file.filename); // or req.file.path
      }
      console.log('OPTIONS TO SAVE:', options);
  
      const attribute = await Attribute.create({
        name,
        slug,
        inputType,
        options,
        isRequired: isRequired === 'true',      // string to boolean
        isVariantLevel: isVariantLevel === 'true',
      });
      console.log('ATTRIBUTE CREATED:', attribute);
  
      res.status(201).json({ message: 'Attribute created', attribute });
    } catch (error: any) {
      res.status(500).json({
        message: 'Error creating attribute',
        error: error.message,
      });
    }
  };
  

export const getAttributes = async (_req: Request, res: Response) => {
  try {
    const attributes = await Attribute.find();
    res.status(200).json({ message: "Attributes fetched", attributes });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching attributes", error: error.message });
  }
};

export const getAttributeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid attribute ID" });

  try {
    const attribute = await Attribute.findById(id);
    if (!attribute)
      return res.status(404).json({ message: "Attribute not found" });
    res.status(200).json({ message: "Attribute fetched", attribute });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching attribute", error: error.message });
  }
};

export const updateAttribute = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid attribute ID" });
  
    try {
      const {
        name,
        slug,
        inputType,
        isRequired,
        isVariantLevel,
      } = req.body;
  
      let rawOptions = req.body.options;
      let options: string[] = [];
      if (inputType === 'dropdown' || inputType === 'multi-select') {
        if (Array.isArray(rawOptions)) {
          options = rawOptions;
        } else if (typeof rawOptions === 'string') {
          // If only one option is sent, FormData sends it as a string
          options = [rawOptions];
        } else {
          options = [];
        }
      }
  
      // File support for file inputType (if needed in update)
      if (inputType === 'file' && req.file) {
        options.push(req.file.filename); // or req.file.path
      }
  
      const updateData = {
        name,
        slug,
        inputType,
        options,
        isRequired: isRequired === 'true' || isRequired === true,
        isVariantLevel: isVariantLevel === 'true' || isVariantLevel === true,
      };
      console.log('UPDATE DATA:', updateData);
  
      const updated = await Attribute.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (!updated)
        return res.status(404).json({ message: "Attribute not found" });
  
      res.status(200).json({ message: "Attribute updated", attribute: updated });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error updating attribute", error: error.message });
    }
  };
  

export const deleteAttribute = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid attribute ID" });

  try {
    const deleted = await Attribute.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Attribute not found" });
    res.status(200).json({ message: "Attribute deleted" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting attribute", error: error.message });
  }
};
