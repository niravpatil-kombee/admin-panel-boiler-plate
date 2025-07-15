import { Request, Response } from 'express';

import Role from '../models/Role';
import { isValidObjectId } from 'mongoose';

export const create = async (req: Request, res: Response) => {
    const roleData = {
        name: req.body.name,
        permissions: req.body.permissions,
    }
    try {
        const existingRole = await Role.findOne({ name: req.body.name });
        if (existingRole) {
          return res.status(409).json({
            message: "Role already exists with this name",
          });
        }

        const role = new Role(roleData);
        await role.save();

        return res.status(201).json({
            message: "Role created successfully",
            role,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Error while creating role",
            error: error.message,
          });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
      const roles = await Role.find().populate('permissions').exec();
      res.status(200).json({
        message: "Roles fetched!",
        totalRoles: roles.length,
        roles,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error in fetch roles",
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

export const getOne = async (req: Request, res: Response) => {
    const roleId = req.params.id;
    try {
        if (!isValidObjectId(roleId)) {
            return res.status(400).json({
              message: "roleId is not valid",
              Id: roleId,
            });
          }
        // Populate permissions when fetching a role by ID
        const role = await Role.findById(req.params.id).populate('permissions').exec();
        if (!role) {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        res.status(200).json({
            message: "Role fetched!",
            role,
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    const roleId = req.params.id;
    try {
        if (!isValidObjectId(roleId)) {
            return res.status(400).json({
              message: "roleId is not valid",
              Id: roleId,
            });
          }
        const role = await Role.findByIdAndUpdate(roleId, req.body, { new: true }).exec();
        if (!role) {
            return res.status(404).json({
              message: "Role not found",
            });
          }
        res.status(200).json({
            message: "Role updated successfully",
            role,
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    const roleId = req.params.id;
    try {
        if (!isValidObjectId(roleId)) {
            return res.status(400).json({
              message: "roleId is not valid",
              Id: roleId,
            });
          }
        const role = await Role.findByIdAndDelete(roleId).exec();
        if (!role) {
            return res.status(404).json({
                message: "Role not found",
              });
          }
        res.status(200).json({
            message: "Role deleted successfully",
            role,
        });
    } catch (error: any) {
        return res.status(500).json({ message: 'Error deleting role.' });
    }
};
