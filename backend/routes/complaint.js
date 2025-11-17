import express from 'express';
import { fileComplaint, getUserComplaints } from '../controllers/complaintController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/file', authMiddleware, fileComplaint); // protected route
router.get('/mycomplaints', authMiddleware, getUserComplaints); // protected route

export default router;
