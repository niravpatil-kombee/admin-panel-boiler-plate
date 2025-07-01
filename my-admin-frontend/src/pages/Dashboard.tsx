import { useEffect, useState } from 'react';
import { 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import useAuth from '../hooks/useAuth';
import { getUsersAPI, updateUserAPI } from '../services/auth.api';
import { getRolesAPI } from '../services/role.api';
import type { User } from '../types/auth';
import type { Role } from '../types/role';

export default function DashboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const isSuperAdmin = currentUser?.role?.name === 'SuperAdmin';

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersData, rolesData] = await Promise.all([
                getUsersAPI(),
                getRolesAPI()
            ]);
            
            // Filter roles to only show Viewer and Editor for assignment
            const allowedRoles = rolesData.roles.filter((role: Role) => 
                role.name === 'Viewer' || role.name === 'Editor'
            );
            
            setUsers(usersData.users);
            setRoles(allowedRoles);
        } catch (error) {
            enqueueSnackbar('Failed to fetch data', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRoleChange = async (userId: string, newRoleId: string) => {
        try {
            await updateUserAPI(userId, { role: newRoleId });
            enqueueSnackbar('User role updated successfully', { variant: 'success' });
            fetchData(); // Refresh the data
        } catch (error) {
            enqueueSnackbar('Failed to update user role', { variant: 'error' });
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Welcome to the Admin Dashboard
            </Typography>

            {isSuperAdmin && (
                <Card sx={{ mt: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            User Role Management
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Current Role</TableCell>
                                        <TableCell>Change Role</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role.name}</TableCell>
                                            <TableCell>
                                                {user.role.name !== 'SuperAdmin' && (
                                                    <FormControl fullWidth size="small">
                                                        <Select
                                                            value={user.role._id}
                                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                        >
                                                            {roles.map((role) => (
                                                                <MenuItem key={role._id} value={role._id}>
                                                                    {role.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {/* Statistics Section */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Total Users
                            </Typography>
                            <Typography variant="h3">
                                {users.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Viewers
                            </Typography>
                            <Typography variant="h3">
                                {users.filter(user => user.role.name === 'Viewer').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Editors
                            </Typography>
                            <Typography variant="h3">
                                {users.filter(user => user.role.name === 'Editor').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}