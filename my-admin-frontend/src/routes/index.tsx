import { useRoutes, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import LoginPage from '../pages/Login';
import DashboardPage from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import UserListPage from '../pages/users/UserList';
import RoleListPage from '../pages/roles/RoleList';
import ProductListPage from '../pages/products/ProductList';
import UserFormPage from '../pages/users/UserForm';
import RoleFormPage from '../pages/roles/RoleForm';
import ProductFormPage from '../pages/products/ProductForm';
import CategoryListPage from '../pages/category/CategoryList';
import CategoryFormPage from '../pages/category/CategoryForm';
import BrandListPage from '../pages/brands/BrandList';
import BrandFormPage from '../pages/brands/BrandForm';
import CollectionListPage from '../pages/collection/CollectionList';
import CollectionFormPage from '../pages/collection/CollectionForm';
import AttributeForm from '../pages/attributes/AttributesForm';
import AttributesList from '../pages/attributes/AttributesList';
import WarehouseListPage from '../pages/warehouses/WarehouseList';
import WarehouseFormPage from '../pages/warehouses/WarehouseForm';
import InventoryListPage from '../pages/inventory/InventoryList';
import InventoryFormPage from '../pages/inventory/InventoryForm';
import ForgotPasswordPage from '../pages/ForgotPassword';
import ResetPasswordPage from '../pages/ResetPassword';

export default function AppRouter() {
    const routes = useRoutes([
        {
            path: '/auth',
            children: [
                { 
                    path: 'login', 
                    element: (
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    ) 
                },
                { 
                    path: 'forgot-password', 
                    element: (
                        <PublicRoute>
                            <ForgotPasswordPage />
                        </PublicRoute>
                    ) 
                },
                { path: '*', element: <Navigate to="/auth/login" replace /> }
            ]
        },
        {
            path: '/reset-password/:token',
            element: (
                <PublicRoute>
                    <ResetPasswordPage />
                </PublicRoute>
            )
        },
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            ),
            children: [
                { path: 'dashboard', element: <DashboardPage /> },
                { path: 'users', element: <UserListPage /> },
                { path: 'roles', element: <RoleListPage /> },
                { path: 'products', element: <ProductListPage /> },
                { path: 'categories', element: <CategoryListPage /> },
                { path: 'brands', element: <BrandListPage /> },
                { path: 'collections', element: <CollectionListPage /> },
                { path: '', element: <Navigate to="/dashboard" replace /> },
                { path: '', element: <UserListPage /> },
                { path: 'users/new', element: <UserFormPage /> },
                { path: '/users/edit/:id', element: <UserFormPage /> },
                { path: 'roles/new', element: <RoleFormPage /> },
                { path: 'roles/edit/:id', element: <RoleFormPage /> },
                { path: 'products/new', element: <ProductFormPage /> },
                { path: 'products/edit/:id', element: <ProductFormPage /> },
                { path: 'categories/new', element: <CategoryFormPage /> },
                { path: 'categories/edit/:id', element: <CategoryFormPage /> },
                { path: 'brands/new', element: <BrandFormPage /> },
                { path: 'brands/edit/:id', element: <BrandFormPage /> },
                { path: 'collections/new', element: <CollectionFormPage /> },
                { path: 'collections/edit/:id', element: <CollectionFormPage /> },
                { path: 'attributes', element: <AttributesList /> },
                { path: 'attributes/new', element: <AttributeForm /> },
                { path: 'attributes/edit/:id', element: <AttributeForm /> },
                { path: 'warehouses', element: <WarehouseListPage /> },
                { path: 'warehouses/new', element: <WarehouseFormPage /> },
                { path: 'warehouses/edit/:id', element: <WarehouseFormPage /> },
                { path: 'inventory', element: <InventoryListPage /> },
                { path: 'inventory/new', element: <InventoryFormPage /> },
                { path: 'inventory/edit/:id', element: <InventoryFormPage /> },
            ]
        },
        { path: '*', element: <Navigate to="/" replace /> },
    ]);
    return routes;
}