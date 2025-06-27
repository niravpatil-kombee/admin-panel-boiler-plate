import Permission from '../models/Permission';
import { IPermission } from '../types';

export const getPermissions = async (): Promise<IPermission[]> => {
  return await Permission.find().sort({ name: 1 });
};
