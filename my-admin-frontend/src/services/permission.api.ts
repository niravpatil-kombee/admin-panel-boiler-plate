import axios from '../utils/axios';

export interface GetPermissionsResponse {
    message: string;
    totalPermissions: number;
    permissions: any[];
}

export const getPermissionsAPI = async (): Promise<GetPermissionsResponse> => {
    const { data } = await axios.get('/permissions');
    return data;
};
