import express from 'express';
import {
  submitComplaint,
  updateComplaintStatus,
  getAllComplaintsStatus,
  getAllComplaintsForAdmin,
  getUserComplaints,
  undoStatus,
  redoStatus,
} from '../controllers/report.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/complaint',           authMiddleware, submitComplaint);
router.put('/complaint/status',     authMiddleware, updateComplaintStatus);
router.get('/complaints/status',    authMiddleware, getAllComplaintsStatus);
router.get('/complaints/admin',     authMiddleware, getAllComplaintsForAdmin);
router.get('/complaints/user',      authMiddleware, getUserComplaints);
router.post('/complaint/undo',      authMiddleware, undoStatus);
router.post('/complaint/redo',      authMiddleware, redoStatus);

export default router;