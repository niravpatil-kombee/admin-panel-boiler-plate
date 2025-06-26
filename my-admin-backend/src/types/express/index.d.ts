import { IUser } from '../../models/User';
import 'express-session';

declare global {
    namespace Express {
        export interface Request {
            user?: IUser;
        }
    }
}

declare module 'express-session' {
  interface SessionData {
    passport?: { user: string };
  }
} 