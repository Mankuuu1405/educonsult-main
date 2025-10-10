// server/socket.js
import { Server } from 'socket.io';
import Message from './models/Message.js';

export const initializeSocket = (server) => {
    const io = new Server(server, { cors: {
origin: process.env.FRONTEND_URL ,
methods: ["GET", "POST"],
}, });
    io.on('connection', (socket) => {
        socket.on('joinRoom', ({ sessionId }) => {
            socket.join(sessionId);
            console.log(`User ${socket.id} joined room ${sessionId}`);
        });

        socket.on('sendMessage', async (data) => {
            const { session, sender, senderModel, content } = data;
            try {
                const newMessage = new Message({ session, sender, senderModel, content });
                await newMessage.save();
                io.to(session).emit('receiveMessage', newMessage);
            } catch (error) {
                console.error('Error in sendMessage:', error);
            }
        });
       
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};