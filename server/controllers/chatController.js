import Message from '../models/Message.js';
import ChatSession from '../models/ChatSession.js';
import Booking from '../models/Booking.js';
// @desc Find an existing chat session or create a new one based on a booking
// @route POST /api/chat/session


export const getOrCreateChatSession = async (req, res) => {
    const { bookingId } = req.body;
    try {
        let session = await ChatSession.findOne({ booking: bookingId });
        if (!session) {
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            // Ensure the person trying to create the session is part of the booking
            if (req.user._id.toString() !== booking.student.toString() && req.user._id.toString() !== booking.faculty.toString()) {
                return res.status(401).json({ message: 'Not authorized for this booking' });
            }
            session = await ChatSession.create({
                booking: bookingId,
                student: booking.student,
                faculty: booking.faculty,
            });
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc Get all messages for a specific chat session
// @route GET /api/chat/messages/:sessionId
export const getMessagesBySessionId = async (req, res) => {
    try {
        const messages = await Message.find({ session: req.params.sessionId }).sort('createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};