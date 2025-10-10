import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

// @desc    Get bookings for the logged-in student
export const getMyStudentBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ student: req.user._id })
            .populate({ path: 'service', select: 'title' })
            .populate({ path: 'faculty', select: 'fullName' });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getMyFacultyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ faculty: req.user._id })
            // We now populate the STUDENT's name and the SERVICE's title
            .populate({ path: 'service', select: 'title' })
            .populate({ path: 'student', select: 'fullName' });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createFreeBooking = async (req, res) => {
    try {
        const { serviceId } = req.body;
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Check if a booking for this service by this student already exists
        const existingBooking = await Booking.findOne({ service: serviceId, student: req.user._id });
        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this session.' });
        }

        const booking = await Booking.create({
            service: serviceId,
            student: req.user._id,
            faculty: service.faculty,
            priceAtBooking: service.price, // Still good to record the original price
            currencyAtBooking: service.currency,
            status: 'completed', // Instantly completed
        });

        res.status(201).json({ message: 'Booking confirmed successfully!', booking });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};