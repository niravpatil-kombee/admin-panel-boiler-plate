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

export default function UserFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const isEdit = !!id;
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormData>({
        defaultValues: { name: '', email: '', password: '', role: '' },
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rolesData = await getRolesAPI();
                setRoles(rolesData);

                if (isEdit && id) {
                    const userData = await getUserByIdAPI(id);
                    reset({
                        name: userData.name,
                        email: userData.email,
                        role: userData.role._id,
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

    const onSubmit: SubmitHandler<UserFormData> = async (data) => {
        try {
            if (isEdit && id) {
                const updateData: Partial<UserFormData> = { ...data };
                if (!updateData.password) {
                    delete updateData.password;
                }
                await updateUserAPI(id, updateData);
                enqueueSnackbar('User updated successfully!', { variant: 'success' });
            } else {
                await createUserAPI(data);
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
                                rules={{ required: 'Name is required' }}
                                render={({ field }) => (
                                    <TextField {...field} label="Full Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                                )}
                            />
                        </Box>

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                                }}
                                render={({ field }) => (
                                    <TextField {...field} label="Email Address" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                                )}
                            />
                        </Box>

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Controller
                                name="role"
                                control={control}
                                rules={{ required: 'Role is required' }}
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

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: !isEdit, minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        label="Password"
                                        fullWidth
                                        error={!!errors.password}
                                        helperText={errors.password?.message || (isEdit ? 'Leave blank to keep current password' : '')}
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