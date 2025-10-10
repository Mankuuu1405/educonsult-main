import express from 'express';
const router = express.Router();
import { getMyServices, createService, deleteService,getServicesByFacultyId } from '../controllers/serviceController.js';
import { protect } from '../middlewares/authMiddleware.js';

// Apply the 'protect' middleware to all these routes
router.get('/faculty/:facultyId', getServicesByFacultyId);


// --- PROTECTED ROUTES (for logged-in faculty) ---
router.route('/')
    .post(protect, createService);

router.route('/my-services')
    .get(protect, getMyServices);

router.route('/:id')
    .delete(protect, deleteService);

export default router;