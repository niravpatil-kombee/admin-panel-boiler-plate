import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { PassportStatic } from 'passport';
import User from '../models/User';
import Role from '../models/Role';

// Options for JWT Strategy
const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
};

// JWT Strategy: Authenticate users based on a token
const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.id).populate({
            path: 'role',
            populate: { path: 'permissions' } // Populate permissions within the role
        });

        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

// Local Strategy: Authenticate users based on email and password
const localStrategy = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        // Find the user by email, and also select the password which is hidden by default
        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.password) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        // If everything is ok, return the user
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

// Function to apply strategies to the passport instance
export const applyPassportStrategy = (passport: PassportStatic) => {
    passport.use(jwtStrategy);
    passport.use(localStrategy);
};