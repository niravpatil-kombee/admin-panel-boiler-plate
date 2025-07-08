import type { ElementType } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CollectionsIcon from '@mui/icons-material/Collections';
import AttributesIcon from '@mui/icons-material/LocalOffer'

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
    {
        title: 'Category Management',
        path: '/categories',
        icon: CategoryIcon,
        permission: 'category:read',
    },
    {
        title: 'Brand Management',
        path: '/brands',
        icon: LocalOfferIcon,
        permission: 'brand:read',
    },
    {
        title: 'Collection Management',
        path: '/collections',
        icon: CollectionsIcon,
        permission: 'collection:read',
    },
    {
        title: 'Attributes Management',
        path: '/attributes',
        icon: AttributesIcon,
        permission: 'attribute:read',
    },
];
