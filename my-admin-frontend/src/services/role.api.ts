import axios from '../utils/axios';
import type { Role } from '../types/role';

export const getRolesAPI = async (): Promise<Role[]> => {
    const { data } = await axios.get('/roles');
    return data;
};

export const getRoleByIdAPI = async (id: string): Promise<Role> => {
    const { data } = await axios.get(`/roles/${id}`);
    return data;
};

export const createRoleAPI = async (roleData: Partial<Role>): Promise<Role> => {
    const { data } = await axios.post('/roles', roleData);
    return data;
};

export const updateRoleAPI = async (id: string, roleData: Partial<Role>): Promise<Role> => {
    const { data } = await axios.put(`/roles/${id}`, roleData);
    return data;
};

export const deleteRoleAPI = async (id: string): Promise<void> => {
    await axios.delete(`/roles/${id}`);
};
