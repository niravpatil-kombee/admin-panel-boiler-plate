import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import statusMonitor from "express-status-monitor";
import connectDB from "./config/database";
import "./config/passport";
import { requestLogger, performanceMonitor, errorTracker } from "./middlewares/monitoring";
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add Morgan HTTP request logging
app.use(morgan('combined'));

// Add custom monitoring middleware
app.use(requestLogger);
app.use(performanceMonitor);

// Add Express Status Monitor for real-time performance monitoring
app.use(statusMonitor({
  title: 'Admin Backend Monitor',
  path: '/status',
  spans: [{
    interval: 1,     // Every 1 second
    retention: 60    // Keep 60 data points
  }, {
    interval: 5,     // Every 5 seconds
    retention: 60
  }, {
    interval: 15,    // Every 15 seconds
    retention: 60
  }]
}));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session config with rolling
app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    rolling: true, // ✅ refresh session on every request
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hr
      httpOnly: true,
      secure: false, // use true in production with HTTPS
      sameSite: "lax",
    },
  })
);

// Add this middleware after session middleware
app.use((req, res, next) => {
  if (req.session) {
    const now = new Date().toLocaleString();
    console.log(`[${now}] Session refreshed for user:`, req.session.passport ? req.session.passport.user : "anonymous");
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
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

// Add error tracking middleware (must be last)
app.use(errorTracker);

connectDB();

export default app;

 