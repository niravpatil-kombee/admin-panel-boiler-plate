import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    }
  ));
  
  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).populate({
      path: 'role',
      populate: { path: 'permissions' }
    });
    done(null, user);
  });
