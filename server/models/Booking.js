import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Service' },
    student: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    faculty: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
    // We keep these for potential future use or for free services that have a "value"
    priceAtBooking: { type: Number, required: true },
    currencyAtBooking: { type: String, required: true },
    // Status will always be 'completed' for free bookings
    status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;