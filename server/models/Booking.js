import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Service' },
    student: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    faculty: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
    priceAtBooking: { type: Number, required: true },
    currencyAtBooking: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'], // Added 'pending' and 'failed'
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    paymentDetails: {
        orderId: { type: String },
        paymentId: { type: String },
        signature: { type: String }
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;