import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../models/User';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: IUser | false, info: any) => {
        if (err || !user) {
            return res.status(401).json({ message: info?.message || "Unauthorized" });
        }
        req.user = user;
        return next();
    })(req, res, next);
}; 