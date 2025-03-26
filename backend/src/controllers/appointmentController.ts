import { Request, Response, NextFunction } from 'express';
import Appointment from '../models/Appointment';
import Customer from '../models/Customer';
import AppError from '../utils/AppError';

// Interface for the request with user
interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { assignedDoctor, appointmentDate, appointmentType, notes } = req.body;
    
    // Get customer ID from authenticated user
    const customerId = req.user.customerId;
    
    // Validate customer exists
    const customerExists = await Customer.findOne({ customerId });
    if (!customerExists) {
      return next(new AppError('Customer not found', 404));
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      customerId,
      assignedDoctor,
      appointmentDate,
      appointmentType,
      notes,
      status: 'scheduled'
    });
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments for a customer
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // Get customer ID from authenticated user
    const customerId = req.user.customerId;
    
    // Get all appointments for the customer
    const appointments = await Appointment.find({ customerId }).sort({ appointmentDate: -1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }
    
    // Check if the appointment belongs to the authenticated customer
    if (appointment.customerId !== req.user.customerId && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to access this appointment', 401));
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }
    
    // Check if the appointment belongs to the authenticated customer
    if (appointment.customerId !== req.user.customerId && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this appointment', 401));
    }
    
    // Update appointment
    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }
    
    // Check if the appointment belongs to the authenticated customer
    if (appointment.customerId !== req.user.customerId && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this appointment', 401));
    }
    
    await appointment.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 