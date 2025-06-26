import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

interface TokenPayload {
    id: string; // Use string for serialization
    role: string;
}

const JWT_SECRET: Secret = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: TokenPayload): string => {
    const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m';
    const options: SignOptions = {
        expiresIn: expiresIn as any,
    };
    return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d';
    const options: SignOptions = {
        expiresIn: expiresIn as any,
    };
    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

export const verifyToken = (token: string, isRefreshToken = false): TokenPayload | null => {
    try {
        const secret = isRefreshToken ? JWT_REFRESH_SECRET : JWT_SECRET;
        return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
        return null;
    }
}; 