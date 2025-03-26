import express from 'express';
import {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument
} from '../controllers/documentController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes for all customers
router.get('/', getDocuments);
router.get('/:id', getDocument);

// Routes for signing documents
router.put('/:id', updateDocument);

// Routes restricted to admin
router.post('/', restrictTo('admin'), createDocument);
router.delete('/:id', restrictTo('admin'), deleteDocument);

export default router; 