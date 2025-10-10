import express from 'express';
const router = express.Router();
import { getDashboardStats,getFacultyDetailsForAdmin,getFacultyList,getPlatformFee,setPlatformFee } from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';

// Middleware to check if the user is an admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
router.use(protect, adminOnly);
// All routes are protected and for admins only
router.get('/stats',adminOnly, getDashboardStats);
router.get('/faculty-list', getFacultyList);
router.get('/faculty/:id/details', getFacultyDetailsForAdmin);
router.get('/settings/platform-fee', getPlatformFee);
router.put('/settings/platform-fee', setPlatformFee);

export default router;