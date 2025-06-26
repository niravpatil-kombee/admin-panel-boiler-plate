import type { ElementType } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InventoryIcon from '@mui/icons-material/Inventory';

export interface NavItem {
    title: string;
    path: string;
    icon: ElementType;
    permission?: string;
    children?: NavItem[];
}

export const navConfig: NavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: DashboardIcon,
    },
    {
        title: 'User Management',
        path: '/users',
        icon: PeopleIcon,
        permission: 'user:read',
    },
    {
        title: 'Role Management',
        path: '/roles',
        icon: VpnKeyIcon,
        permission: 'role:read',
    },
    {
        title: 'Product Management',
        path: '/products',
        icon: InventoryIcon,
        permission: 'product:read',
    },
];
