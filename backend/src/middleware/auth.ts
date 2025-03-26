import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer';
import AppError from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

// Interface for the request with user
interface RequestWithUser extends Request {
  user?: any;
}

// Middleware to protect routes - only authenticated users can access
export const protect = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Check if customer still exists
      const customer = await Customer.findById(decoded.id);
      if (!customer) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
      }

      // Add user to request object
      req.user = {
        id: customer._id,
        customerId: customer.customerId,
        email: customer.email,
        role: customer.role,
      };

      next();
    } catch (error) {
      return next(new AppError('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict routes to specific roles
export const restrictTo = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
}; 