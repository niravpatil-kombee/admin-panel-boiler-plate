import { useRoutes, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import LoginPage from '../pages/Login';
import DashboardPage from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
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

export default function AppRouter() {
    const routes = useRoutes([
        {
            path: '/auth',
            children: [
                { path: 'login', element: <LoginPage /> },
                { path: '*', element: <Navigate to="/auth/login" replace /> }
            ]
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
            ]
        },
        { path: '*', element: <Navigate to="/" replace /> },
    ]);
    return routes;
}