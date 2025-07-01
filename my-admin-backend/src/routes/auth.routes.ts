import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { IUser } from '../types';

const router = Router();

// Helper to wrap async route handlers and forward errors
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/register', asyncHandler(authController.register));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: IUser, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Login failed' });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        // Remove password before sending user data
        const userResponse = user.toObject?.() || user;
        delete userResponse.password;
        return res.status(200).json({
          message: "Login successful",
          user: userResponse,
        });
      });
    })(req, res, next);
  });

router.post('/logout', isAuthenticated, asyncHandler(authController.logout));
router.get('/me', isAuthenticated, asyncHandler(authController.me));
router.post("/forgot-password", asyncHandler(authController.forgotPass));
router.post("/reset-password/:token", asyncHandler(authController.resetPass));

export default router; 