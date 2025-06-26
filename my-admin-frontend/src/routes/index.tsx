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
                { path: '', element: <Navigate to="/dashboard" replace /> },
                { path: '', element: <UserListPage /> },
                { path: 'users/new', element: <UserFormPage /> },
                { path: '/users/edit/:id', element: <UserFormPage /> },
                { path: 'roles/new', element: <RoleFormPage /> },
                { path: 'roles/edit/:id', element: <RoleFormPage /> },
            ]
        },
        { path: '*', element: <Navigate to="/" replace /> },
    ]);
    return routes;
}