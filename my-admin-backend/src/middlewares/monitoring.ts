import { Request, Response, NextFunction } from 'express';

// Custom request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log when request starts
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Started`);
  
  // Override res.end to log when request finishes
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): Response {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Color code based on status
    let statusColor = '\x1b[32m'; // Green for 2xx
    if (statusCode >= 400) statusColor = '\x1b[31m'; // Red for 4xx/5xx
    else if (statusCode >= 300) statusColor = '\x1b[33m'; // Yellow for 3xx
    
    console.log(
      `${statusColor}[${new Date().toISOString()}] ${req.method} ${req.path} - ${statusCode} - ${duration}ms\x1b[0m`
    );
    
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
    
    // Log slow requests (over 1 second)
    if (duration > 1000) {
      console.warn(`⚠️  Slow request detected: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
    
    // Log very slow requests (over 5 seconds)
    if (duration > 5000) {
      console.error(`🚨 Very slow request: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};

// Error tracking middleware
export const errorTracker = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`❌ Error in ${req.method} ${req.path}:`, {
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
  
  next(err);
}; 