import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { ICustomer } from '../models/Customer';

// Get JWT secret from environment variables or use a default for development
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Create JWT token
export const generateToken = (customer: ICustomer): string => {
  const payload = { 
    id: customer._id, 
    customerId: customer.customerId,
    email: customer.email,
    role: customer.role 
  };
  
  // Use type assertion to bypass the TypeScript type checking
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  } as jwt.SignOptions);
};

// Verify JWT token
export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}; 