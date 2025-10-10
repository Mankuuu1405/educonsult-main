import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    // Link to the faculty who owns this service
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Faculty',
    },
    title: {
        type: String,
        required: [true, 'Please provide a service title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    currency: {
        type: String,
        required: true,
        enum: ['USD', 'INR'],
        default: 'USD',
    },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;