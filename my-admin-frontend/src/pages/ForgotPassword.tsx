import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { forgotPasswordAPI } from '../services/auth.api';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const forgotSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotSchema = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotSchema>({
        resolver: zodResolver(forgotSchema),
    });
    const [submitted, setSubmitted] = useState(false);

    // Redirect if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit: SubmitHandler<ForgotSchema> = async (data) => {
        try {
            await forgotPasswordAPI(data.email);
            enqueueSnackbar('Password reset email sent!', { variant: 'success' });
            setSubmitted(true);
        } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.message || 'Failed to send reset email', { variant: 'error' });
        }
    };

    // Don't render form if user is authenticated
    if (isAuthenticated) {
        return null; // or a loading spinner
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Forgot Password
                </Typography>
                {submitted ? (
                    <Typography sx={{ mt: 2 }} color="success.main">
                        If an account with that email exists, a password reset link has been sent.
                    </Typography>
                ) : (
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reset Email'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
} 