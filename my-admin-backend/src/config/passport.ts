import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select('+password').populate({
      path: 'role',
      populate: { path: 'permissions' },
    });
    if (!user || !(await user.comparePassword(password))) {
      return done(null, false, { message: 'Invalid credentials' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password').populate({
      path: 'role',
      populate: { path: 'permissions' }
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
