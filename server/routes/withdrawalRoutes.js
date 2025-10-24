// /routes/withdrawalRoutes.js
import express from 'express';
const router = express.Router();
import { protect, adminOnly } from '../middlewares/authMiddleware.js'; // Your auth middlewares
import { createWithdrawalRequest, getPendingWithdrawals, processWithdrawalRequest } from '../controllers/withdrawalController.js';

// Faculty Route
router.route('/faculty/withdrawals').post(protect, createWithdrawalRequest);

// Admin Routes
router.route('/admin/withdrawals').get(protect, adminOnly, getPendingWithdrawals);
router.route('/admin/withdrawals/:id').put(protect, adminOnly, processWithdrawalRequest);

export default router;