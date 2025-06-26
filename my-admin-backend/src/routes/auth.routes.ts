import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// Helper to wrap async route handlers and forward errors
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(authController.register));

router.post(
    '/login',
    passport.authenticate('local', { session: false, failureMessage: true }),
    asyncHandler(authController.login)
);

router.post('/refresh-token', asyncHandler(authController.refreshToken));

router.post('/logout', isAuthenticated, asyncHandler(authController.logout));

router.get('/me', isAuthenticated, asyncHandler(authController.me));

export default router; 