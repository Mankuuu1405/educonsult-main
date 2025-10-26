import express from 'express';
const router = express.Router();
import { getMyStudentBookings,getMyFacultyBookings,createFreeBooking ,initiateBookingPayment, // <-- Import new
    verifyBookingPayment} from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';


router.get('/my-bookings', protect, getMyStudentBookings);
router.get('/my-faculty-bookings', protect, getMyFacultyBookings);

//razorPay routes

// --- Payment Routes ---
router.post('/initiate-payment', protect, initiateBookingPayment);
router.post('/verify-payment', protect, verifyBookingPayment);


router.post('/create-free',protect, createFreeBooking); 
export default router;