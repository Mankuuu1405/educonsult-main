import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    faculty: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
    student: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    booking: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Booking', unique: true }, // One review per booking
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true }, // Can be used for moderation by admin later
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;