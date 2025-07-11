import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { Box, TextField, Button, Typography, Container, Paper, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { resetPasswordAPI } from '../services/auth.api';

const resetSchema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetSchema = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const location = useLocation();
    // Determine mode from query param (?mode=set or ?mode=reset)
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode') === 'set' ? 'set' : 'reset';
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetSchema>({
        resolver: zodResolver(resetSchema),
    });
    const [submitted, setSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const onSubmit: SubmitHandler<ResetSchema> = async (data) => {
        if (!token) {
            enqueueSnackbar('Invalid or missing token.', { variant: 'error' });
            return;
        }
        try {
            await resetPasswordAPI(token, data.newPassword);
            enqueueSnackbar(
                mode === 'set' ? 'Password has been set successfully!' : 'Password has been reset successfully!',
                { variant: 'success' }
            );
            setSubmitted(true);
            setTimeout(() => navigate('/auth/login'), 2000);
        } catch (error: any) {
            enqueueSnackbar(error?.response?.data?.message || 'Failed to reset password', { variant: 'error' });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    {mode === 'set' ? 'Set Password' : 'Reset Password'}
                </Typography>
                {submitted ? (
                    <Typography sx={{ mt: 2 }} color="success.main">
                        {mode === 'set'
                            ? 'Password set! Redirecting to login...'
                            : 'Password reset! Redirecting to login...'}
                    </Typography>
                ) : (
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('newPassword')}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowPassword((show) => !show)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            type={showConfirm ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                            onClick={() => setShowConfirm((show) => !show)}
                                            edge="end"
                                        >
                                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (mode === 'set' ? 'Setting...' : 'Resetting...')
                                : (mode === 'set' ? 'Set Password' : 'Reset Password')}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
} 