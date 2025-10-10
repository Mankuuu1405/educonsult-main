import express from 'express';
const router = express.Router();
import { getStudentDetails, updateStudentDetails } from '../controllers/studentController.js';
import { protect } from '../middlewares/authMiddleware.js';

// All routes are protected and specific to the logged-in student
router.route('/me/details')
    .get(protect, getStudentDetails)
    .put(protect, updateStudentDetails);

export default router;