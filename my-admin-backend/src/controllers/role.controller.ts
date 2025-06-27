import { Request, Response } from 'express';
import * as roleService from '../services/role.service';

export const create = async (req: Request, res: Response) => {
    try {
        const role = await roleService.createRole(req.body);
        return res.status(201).json(role);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAll = async (_req: Request, res: Response) => {
    try {
        const roles = await roleService.getRoles();
        return res.status(200).json(roles);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching roles.' });
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const role = await roleService.getRoleById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        return res.status(200).json(role);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const role = await roleService.updateRole(req.params.id, req.body);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        return res.status(200).json(role);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const role = await roleService.deleteRole(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        return res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({ message: 'Error deleting role.' });
    }
};
