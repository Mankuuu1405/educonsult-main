import jwt from 'jsonwebtoken';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';

export const protect = async (req, res, next) => {
    let token;

    // --- 1. THE FIX: Read the token ONLY from the cookie ---
    if (req.cookies.token) {
        token = req.cookies.token;
    }

    // --- 2. Check if the token exists ---
    if (!token) {
        // This will now correctly trigger if the cookie is missing.
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }

    try {
        // --- 3. Verify the token from the cookie ---
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // --- 4. Get user from the token's ID and role (this part is correct) ---
        if (decoded.role === 'student') {
            req.user = await Student.findById(decoded.id).select('-password');
        } else {
            // Includes 'faculty' and 'admin' roles
            req.user = await Faculty.findById(decoded.id).select('-password');
        }

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found.' });
        }

        // If everything is okay, proceed to the next middleware or the controller
        next();

    } catch (error) {
        // This will catch errors from jwt.verify if the token is invalid or expired
        res.status(401).json({ message: 'Not authorized, token failed.' });
    }
};