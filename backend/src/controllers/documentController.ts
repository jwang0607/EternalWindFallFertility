import { Request, Response, NextFunction } from 'express';
import Document from '../models/Document';
import Customer from '../models/Customer';
import AppError from '../utils/AppError';

// Interface for the request with user
interface RequestWithUser extends Request {
  user?: any;
}

// @desc    Create a new document
// @route   POST /api/documents
// @access  Private/Admin
export const createDocument = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { customerId, title, type, fileUrl, status, signingUrl, expiryDate, notes } = req.body;
    
    // Validate customer exists
    const customerExists = await Customer.findOne({ customerId });
    if (!customerExists) {
      return next(new AppError('Customer not found', 404));
    }
    
    // Create document
    const document = await Document.create({
      customerId,
      title,
      type,
      fileUrl,
      status: status || 'draft',
      signingUrl,
      expiryDate,
      notes
    });
    
    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents for a customer
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // Get customer ID from authenticated user
    const customerId = req.user.customerId;
    
    // Get all documents for the customer
    const documents = await Document.find({ customerId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single document
// @route   GET /api/documents/:id
// @access  Private
export const getDocument = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // Check if the document belongs to the authenticated customer
    if (document.customerId !== req.user.customerId && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to access this document', 401));
    }
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private/Admin
export const updateDocument = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    let document = await Document.findById(req.params.id);
    
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // Only admin can update documents unless it's a signing update
    if (req.user.role !== 'admin' && 
        !(req.body.status === 'signed' && document.customerId === req.user.customerId)) {
      return next(new AppError('Not authorized to update this document', 401));
    }
    
    // If status is being changed to 'signed', add signed date
    if (req.body.status === 'signed' && document.status !== 'signed') {
      req.body.signedDate = new Date();
    }
    
    // Update document
    document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
export const deleteDocument = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return next(new AppError('Document not found', 404));
    }
    
    // Only admin can delete documents
    if (req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this document', 401));
    }
    
    await document.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
}; 