import { Request, Response, NextFunction } from 'express';
import Customer, { ICustomer } from '../models/Customer';
import AppError from '../utils/AppError';
import { generateToken } from '../utils/jwt';

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if customer already exists
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      return next(new AppError('Email already in use', 400));
    }

    // Create new customer
    const customer = await Customer.create({
      email,
      password,
      firstName,
      lastName
      // customerId is automatically generated
    });

    // Generate JWT token
    const token = generateToken(customer);

    // Return customer data without password
    res.status(201).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        customerId: customer.customerId,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        role: customer.role,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login customer
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check if customer exists and password is correct
    const customer = await Customer.findOne({ email }).select('+password');
    if (!customer || !(await customer.comparePassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Generate JWT token
    const token = generateToken(customer);

    // Return customer data without password
    res.status(200).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        customerId: customer.customerId,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        role: customer.role,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current customer profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Customer is already available in req due to the protect middleware
    const customer = await Customer.findById((req as any).user.id);

    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }

    res.status(200).json({
      id: customer._id,
      customerId: customer.customerId,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
      role: customer.role,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, phone, address, city, state, zipCode } = req.body;

    // Find and update the customer
    const customer = await Customer.findByIdAndUpdate(
      (req as any).user.id,
      {
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zipCode
      },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }

    res.status(200).json({
      id: customer._id,
      customerId: customer.customerId,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
      role: customer.role,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    });
  } catch (error) {
    next(error);
  }
}; 