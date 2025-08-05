import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
// Grid has been removed from the import as it's no longer used
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import type { UserFormData } from '../../services/auth.api';
import { createUserAPI, getUserByIdAPI, updateUserAPI } from '../../services/auth.api';
import { getRolesAPI } from '../../services/role.api';
import type { Role } from '../../types/role';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const getUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    // Password is optional and has no validation, always present
    password: z.string().optional(),
    role: z.string().min(1, 'Role is required'),
});

type UserFormSchema = z.infer<typeof getUserSchema>;

export default function UserFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormSchema>({
        resolver: zodResolver(getUserSchema),
        defaultValues: { name: '', email: '', password: '', role: '' },
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rolesData = await getRolesAPI();
                setRoles(rolesData.roles);

                if (isEdit && id) {
                    const userData = await getUserByIdAPI(id);
                    reset({
                        name: userData.name,
                        email: userData.email,
                        role:
                            typeof userData.role === 'object' && userData.role !== null && '_id' in userData.role
                                ? (userData.role as any)._id
                                : userData.role,
                        password: '',
                    });
                }
            } catch (error) {
                enqueueSnackbar('Failed to load data', { variant: 'error' });
                navigate('/users');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEdit, navigate, enqueueSnackbar, reset]);

    const onSubmit: SubmitHandler<UserFormSchema> = async (data) => {
        try {
            if (isEdit && id) {
                // Destructure password and cast if present
                const { password, ...rest } = data;
                const updateData: Partial<UserFormData> = {
                    ...rest,
                    ...(password !== undefined && password !== '' ? { password: String(password) } : {})
                };
                await updateUserAPI(id, updateData);
                enqueueSnackbar('User updated successfully!', { variant: 'success' });
            } else {
                // Destructure password and cast to string
                const { password, ...rest } = data;
                const createData: UserFormData = {
                    ...rest,
                    password: String(password)
                };
                await createUserAPI(createData);
                enqueueSnackbar('User created successfully!', { variant: 'success' });
            }
            navigate('/users');
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'An error occurred', { variant: 'error' });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isEdit ? 'Edit User' : 'Create New User'}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* This Box now acts as the container, using Flexbox */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {/* Each child Box defines its own width responsively */}
                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Full Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                                )}
                            />
                        </Box>

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Email Address" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                                )}
                            />
                        </Box>

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label="Role" fullWidth error={!!errors.role} helperText={errors.role?.message}>
                                        {roles.map((option) => (
                                            <MenuItem key={option._id} value={option._id}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Box>

                        {/* Only show password field for create */}
                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        label="Password"
                                        fullWidth
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => navigate('/users')} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save User'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}