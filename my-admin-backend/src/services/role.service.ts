import Role, { IRole } from '../models/Role';
import { Types } from 'mongoose';

interface RoleData {
    name: string;
    permissions: Types.ObjectId[];
}

export const createRole = async (roleData: RoleData): Promise<IRole> => {
    if (await Role.findOne({ name: roleData.name })) {
        throw new Error('Role with this name already exists.');
    }
    const role = new Role(roleData);
    return await role.save();
};

export const getRoles = async (): Promise<IRole[]> => {
    return await Role.find().populate('permissions');
};

export const getRoleById = async (id: string): Promise<IRole | null> => {
    return await Role.findById(id).populate('permissions');
};

export const updateRole = async (id: string, roleData: Partial<RoleData>): Promise<IRole | null> => {
    const role = await Role.findByIdAndUpdate(id, roleData, { new: true });
    return role;
};

export const deleteRole = async (id: string): Promise<IRole | null> => {
    return await Role.findByIdAndDelete(id);
}; 