import { Request, Response } from 'express';
import * as roleService from '../services/role.service';

export const create = async (req: Request, res: Response) => {
    try {
        const role = await roleService.createRole(req.body);
        res.status(201).json(role);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAll = async (req: Request, res: Response) => {
    const roles = await roleService.getRoles();
    res.status(200).json(roles);
};

export const getOne = async (req: Request, res: Response) => {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json(role);
};

export const update = async (req: Request, res: Response) => {
    const role = await roleService.updateRole(req.params.id, req.body);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(200).json(role);
};

export const remove = async (req: Request, res: Response) => {
    const role = await roleService.deleteRole(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.status(204).send();
}; 