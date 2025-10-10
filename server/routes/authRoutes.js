import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { 
    registerFaculty, loginFaculty, 
    registerStudent, loginStudent, 
    verifyOtp, forgotPassword, resetPassword 
} from '../controllers/authController.js';

// --- Define the Rate Limiter ---
const loginLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: 'Too many login attempts from this IP, please try again after a minute'
});

// --- Define Validation Rule Arrays ---
const signupValidation = [
    body('fullName').not().isEmpty().trim().escape().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail({ gmail_remove_dots: false }),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail({ gmail_remove_dots: false }),
    body('password').not().isEmpty().withMessage('Password is required')
];

const resetPasswordValidation = [
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character')
];


// --- Apply Middleware directly to each route ---

// Faculty Routes
router.post('/faculty/signup', signupValidation, registerFaculty);
router.post('/faculty/login', loginLimiter, loginValidation, loginFaculty);

// Student Routes
router.post('/student/signup', signupValidation, registerStudent);
router.post('/student/login', loginLimiter, loginValidation, loginStudent);

// Other Routes (No password validation needed here)
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', body('email').isEmail().normalizeEmail(), forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, resetPassword);

export default router;