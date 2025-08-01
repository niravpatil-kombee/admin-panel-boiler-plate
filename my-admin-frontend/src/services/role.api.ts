import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';
import type { Role } from '../types/role';

export interface GetRolesResponse {
    message: string;
    totalRoles: number;
    roles: Role[];
}

export const getRolesAPI = (): Promise<GetRolesResponse> =>
    apiHandler(() => axios.get('/roles').then(res => res.data));

export const getRoleByIdAPI = (id: string): Promise<Role> =>
    apiHandler(() => axios.get(`/roles/${id}`).then(res => res.data.role));

export const createRoleAPI = (roleData: Partial<Role>): Promise<Role> =>
    apiHandler(() => axios.post('/roles', roleData).then(res => res.data));

export const updateRoleAPI = (id: string, roleData: Partial<Role>): Promise<Role> =>
    apiHandler(() => axios.put(`/roles/${id}`, roleData).then(res => res.data));

export const deleteRoleAPI = (id: string): Promise<void> =>
    apiHandler(() => axios.delete(`/roles/${id}`).then(() => undefined));
