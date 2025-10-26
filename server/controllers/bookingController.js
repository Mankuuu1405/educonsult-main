import razorpay from 'razorpay';
import crypto from 'crypto';
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

//rayzor pay booking
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Initiate payment for a booking
// @route   POST /api/bookings/initiate-payment
export const initiateBookingPayment = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { serviceId } = req.body;

        const service = await Service.findById(serviceId).populate('faculty');
        console.log(service);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found.' });
        }
        // if (!service.faculty.isAvailable) {
        //     return res.status(400).json({ success: false, message: 'This mentor is currently not available.' });
        // }

        const amount = service.price * 100; // Amount in paise
        const options = {
            amount,
            currency: 'INR', // Or service.currency if you support multiple
            receipt: `receipt_booking_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        // Create a booking record with 'pending' status
        await Booking.create({
            service: serviceId,
            student: studentId,
            faculty: service.faculty._id,
            priceAtBooking: service.price,
            currencyAtBooking: service.currency,
            status: 'pending',
            paymentStatus: 'pending',
            paymentDetails: {
                orderId: order.id,
            }
        });

        res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });

    } catch (error) {
        console.error("Payment initiation failed:", error);
        res.status(500).json({ success: false, message: 'Payment initiation failed' });
    }
};

// @desc    Verify payment and update booking status
// @route   POST /api/bookings/verify-payment
export const verifyBookingPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const studentId = req.user._id;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        // Find the booking by orderId and update it
        const updatedBooking = await Booking.findOneAndUpdate(
            {
                student: studentId,
                "paymentDetails.orderId": razorpay_order_id
            },
            {
                status: 'completed',
                paymentStatus: 'successful',
                "paymentDetails.paymentId": razorpay_payment_id,
                "paymentDetails.signature": razorpay_signature,
            },
            { new: true } // Return the updated document
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found for this order.' });
        }

        res.json({ success: true, message: 'Payment successful! Your session is confirmed.' });

    } catch (error) {
        console.error("Payment verification failed:", error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};