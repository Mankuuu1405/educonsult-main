// /models/withdrawalRequestModel.js
import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to your main User model
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        enum: ['USD', 'INR'] // Add other currencies as needed
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // A snapshot of the payment details at the time of request
    paymentDetails: {
        type: Object,
        required: true
    },
}, { timestamps: true });

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);
export default WithdrawalRequest;