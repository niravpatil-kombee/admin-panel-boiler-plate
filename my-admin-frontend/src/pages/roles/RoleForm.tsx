import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Container, MenuItem, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoleByIdAPI, createRoleAPI, updateRoleAPI } from '../../services/role.api';
import { getPermissionsAPI } from '../../services/permission.api'; 
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  permissions: z.array(z.string()).optional(),
});

type RoleFormSchema = z.infer<typeof roleSchema>;

export default function RoleFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RoleFormSchema>({
        resolver: zodResolver(roleSchema),
        defaultValues: { name: '', permissions: [] }
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all permissions
                const perms = await getPermissionsAPI();
                setPermissions(perms);

                if (isEdit && id) {
                    const role = await getRoleByIdAPI(id);
                    reset({
                        name: role.name,
                        permissions: role.permissions.map((p: any) => p._id),
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit, reset]);

    const onSubmit = async (data: RoleFormSchema) => {
        // Send permissions as string[]
        const payload = {
            name: data.name,
            permissions: data.permissions ?? [],
        };
        if (isEdit && id) {
            await updateRoleAPI(id, payload as any);
        } else {
            await createRoleAPI(payload as any);
        }
        navigate('/roles');
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="sm">
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {isEdit ? 'Edit Role' : 'Create New Role'}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Role Name" fullWidth error={!!errors.name} helperText={errors.name?.message} sx={{ mb: 3 }} />
                        )}
                    />
                    <Controller
                        name="permissions"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Permissions"
                                fullWidth
                                SelectProps={{ multiple: true }}
                                sx={{ mb: 3 }}
                            >
                                {permissions.map((option: any) => (
                                    <MenuItem key={option._id} value={option._id}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={() => navigate('/roles')} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Role'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}
