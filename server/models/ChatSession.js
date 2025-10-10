import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Booking', unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    faculty: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    createdAt: { type: Date, default: Date.now, expires: '30d' }, 
}, { timestamps: true });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
export default ChatSession;