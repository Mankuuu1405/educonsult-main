import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    session: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'ChatSession' 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        // --- THE FIX: This tells Mongoose to look at the 'senderModel' field 
        // to determine which collection this ID refers to (Student or Faculty).
        refPath: 'senderModel' 
    },
    // --- THE FIX: This new field stores the name of the sender's model. ---
    senderModel: {
        type: String,
        required: true,
        enum: ['Student', 'Faculty']
    },
    content: { 
        type: String, 
        required: true, 
        trim: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: '30d' 
    },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;