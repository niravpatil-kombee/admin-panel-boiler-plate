import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import connectDB from "./config/database";
import "./config/passport";
import authRoutes from "./routes/auth.routes";
import roleRoutes from "./routes/role.routes";
import permissionRoutes from "./routes/permission.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import brandRoutes from "./routes/brand.routes";
import categoryRoutes from "./routes/category.routes";
import collectionRoute from "./routes/collection.routes";
import attributesRoute from "./routes/attribute.routes"
import warehouseRoute from "./routes/warehouse.routes"
import inventoryRoute from "./routes/inventory.routes"
import session from "express-session";
import path from "path";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session must come before passport.session()
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000, 
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.post("/api/refresh-session", (req, res) => {

//   if (req.isAuthenticated()) {
//     const user = req.user; // preserve user before regenerating

//     //regenerate session
//     req.session.regenerate((err) => {
//       if (err) {
//         return res.status(500).json({
//           message: "Failed to refresh session",
//         });
//       }

//       //Re-authenticate user
//       req.login(req.user, (loginErr) => {
//         if (loginErr) {
//           return res.status(500).json({ message: "Failed to re-authenticate" });
//         }

//         //Reset the maxAge of the cookie
//         req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hr

//         return res.json({
//           message: "Session refreshed successfully",
//           expiresIn: req.session.cookie.maxAge,
//           user: req.user, 
//         });
//       });
//     });
//   } else {
//     // console.log('Session expired or user not authenticated when calling /api/refresh-session');
//     res.status(401).json({
//       message: "User not authenticated",
//     });
//   }
// });

// In your main app file or auth routes file

app.post("/api/refresh-session", (req, res) => {
  
  if (req.user) {
    const user = req.user; // Securely preserve the user object.

    req.session.regenerate((err) => {
      if (err) {
        console.error("Error regenerating session:", err);
        return res.status(500).json({ message: "Failed to refresh session" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Error re-authenticating after session refresh:", loginErr);
          return res.status(500).json({ message: "Failed to re-authenticate" });
        }
        req.session.cookie.maxAge = 60 * 60 * 1000; // 1 hour

        return res.status(200).json({
          message: "Session refreshed successfully",
          user: user,
        });
      });
    });
  } else {
    // If there is no `req.user`, the user was never logged in or their session
    // was completely destroyed (e.g., server restart, manual logout).
    // In this case, they are truly unauthorized.
    res.status(401).json({
      message: "User not authenticated or session fully expired",
    });
  }
});


app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoute);
app.use("/api/attribute", attributesRoute)
app.use("/api/warehouse", warehouseRoute);
app.use("/api/inventory", inventoryRoute);

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Server is running healthy" });
});

connectDB();

export default app;
 