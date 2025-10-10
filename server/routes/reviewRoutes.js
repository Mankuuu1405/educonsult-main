import express from 'express';
const router = express.Router();
import { createReview, getFacultyReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

// Public route to get reviews
router.get('/faculty/:facultyId', getFacultyReviews);

// Protected route for students to create a review
router.post('/', protect, createReview);

export default router;