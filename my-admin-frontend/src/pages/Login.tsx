import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import useAuth from '../hooks/useAuth';
import type { LoginCredentials } from '../types/auth';
import { useSnackbar } from 'notistack';

export default function LoginPage() {
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
        try {
            await login(data);
            enqueueSnackbar('Login successful!', { variant: 'success' });
        } catch (error: unknown) {
            const err = error as any;
            enqueueSnackbar(err?.response?.data?.message || 'Login failed', { variant: 'error' });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        {...register('email', { required: 'Email is required' })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register('password', { required: 'Password is required' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}