import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// @desc    Create a new review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const studentId = req.user._id;

        const booking = await Booking.findById(bookingId);
        if (!booking || booking.student.toString() !== studentId.toString()) {
            return res.status(401).json({ message: 'Not authorized to review this booking.' });
        }
        
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this session.' });
        }

        const review = await Review.create({
            faculty: booking.faculty,
            student: studentId,
            booking: bookingId,
            rating,
            comment,
        });

        res.status(201).json({ message: 'Review submitted successfully!', review });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


export const getFacultyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ faculty: req.params.facultyId, isApproved: true })
            .populate('student', 'fullName')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};