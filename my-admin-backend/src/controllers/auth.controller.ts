import { NextFunction, Request, Response } from 'express';
import { IUser } from '../types';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { sendRegistrationEmail, sendResetPasswordEmail } from '../utils/emailService';
import Role from '../models/Role';
import passport from 'passport';

const validateEmail = (email: string) => {
    let re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    return !!re.test(email);
  };
  

export const register = async (req: Request, res: Response) => {

    try {
        if (!validateEmail(req.body.email)) {
          return res.status(400).json({
            message: "Invalid Email",
          });
        }
    
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(409).json({
            message: "User already exists with this email",
          });
        }

        const defaultRole = await Role.findOne({ name: 'Viewer' });
        if (!defaultRole) {
          throw new Error('Default role not found. Please run the seeder.');
        }
    
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          role: defaultRole._id
        });
        console.log(user);
    
        const savedUser = await user.save();
    
        // req.login(savedUser, (err) => {
        //   if (err) {
        //     return res.status(500).json({
        //       message: "Error logging in after registration",
        //       error: err.message,
        //     });
        //   }
        //   return res.status(201).json({
        //     message: "User created and logged in successfully!",
        //     user: {
        //       _id: savedUser._id,
        //       email: savedUser.email,
        //       name: savedUser.name,
        //     },
        //   });
        // });
        const emailSent = await sendRegistrationEmail(user.email, user.name);

        if (emailSent) {
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                      _id: savedUser._id,
                      email: savedUser.email,
                      name: savedUser.name,
                      password: savedUser.password,
                      role: defaultRole._id
            },
        });
    }
      } catch (error) {
        return res.status(500).json({
          message: "Error in user registration",
          error: (error as Error).message,
        });
      }
};

// export const login = (req: Request, res: Response, next: NextFunction): Response | void => {
//     passport.authenticate("local", (err: Error | null, user: any, info: { message: string }) => {
//         if (err) {
//           return res.status(500).json({
//             message: "Error in login user",
//             error: err,
//           });
//         }
//         if (!user) {
//           return res.status(401).json({
//             message: info.message || "Login failed",
//           });
//         }
    
//         req.login(user, (err) => {
//           if (err) {
//             return res.status(500).json({
//               message: "Error in login user",
//               error: err,
//             });
//           }
//           return res.status(200).json({
//             message: "Login Successful!",
//             user: {
//               _id: user._id,
//               email: user.email,
//             },
//           });
//         });
//       })(req, res, next);
// };

export const logout = (req: Request, res: Response): void => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout error' });
        }

        res.clearCookie('connect.sid'); // Optional: only if you’re using cookie-session
        return res.status(200).json({ message: 'Logged out successfully' });
    });
};

export const currentUser = async (req: Request, res: Response) => {
    const user = req.user as IUser | undefined;

    if (!user) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    const populatedUser = await User.findById(user._id)
        .select('-password')
        .populate({
            path: 'role',
            populate: { path: 'permissions' }
        });

    if (!populatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: populatedUser });
};


export const forgotPass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email} = req.body;
        const existingUser = await User.findOne({ email });

        if(!existingUser) {
            return res.status(404).json({
                message: "User not found",
            })
        }

        const resetToken = require('crypto').randomBytes(32).toString("hex");

        existingUser.resetPasswordToken = resetToken;
        existingUser.resetPasswordExpires = new Date(Date.now() + 3600000);
        await existingUser.save();

        const emailSent = await sendResetPasswordEmail(email, resetToken, false);

        if (emailSent) {
            res.json({
              message: "Password reset email sent successfully",
            });
          } else {
            existingUser.resetPasswordToken = undefined;
            existingUser.resetPasswordExpires = undefined;
            await existingUser.save();
            res.status(500).json({ message: "Failed to send reset email" });
          }
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
}

// Reset password with token
export const resetPass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
  
      const user = await User.findOne({
        
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({
          message: "Password reset token is invalid or has expired",
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      //Update user password and clear reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.json({
        message: "Password has been reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
