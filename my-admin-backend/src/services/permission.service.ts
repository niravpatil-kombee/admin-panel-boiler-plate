import Permission, { IPermission } from '../models/Permission';
 
export const getPermissions = async (): Promise<IPermission[]> => {
    return await Permission.find().sort({ name: 1 });
}; 