import axios from '../utils/axios';
import { apiHandler } from '../utils/apiHandler';

export interface GetPermissionsResponse {
    message: string;
    totalPermissions: number;
    permissions: any[];
}

export const getPermissionsAPI = (): Promise<GetPermissionsResponse> =>
    apiHandler(() => axios.get('/permissions').then(res => res.data));
