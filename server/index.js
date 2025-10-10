import 'dotenv/config'; // <-- THE FIX: Import and execute dotenv config FIRST.
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js'; 
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import { initializeSocket } from './socket.js'; 
import http from 'http';
import cookieParser from 'cookie-parser'; // <-- Import
import helmet from 'helmet'; // <-- Import
import sanitize from 'mongo-sanitize';
const app = express();


const server = http.createServer(app);
initializeSocket(server);
// Middleware

app.use(helmet());

// 2. Enable CORS with specific origin
// This is crucial to prevent CSRF and other cross-origin attacks
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true // Allow cookies to be sent from the frontend
}));

// 3. Cookie Parser to read cookies from the request
app.use(cookieParser());
app.use(express.json({ limit: '500kb' })); // Increase the limit
app.use(express.urlencoded({ extended: true, limit: '500kb' }));
const clean = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            clean(obj[key]); // Recurse into nested objects
        } else {
            obj[key] = sanitize(obj[key]); // Sanitize the value directly
        }
    }
};

const sanitizeMongoInPlace = (req, res, next) => {
    // Sanitize the body, query, and params by modifying their properties, not reassigning them.
    if (req.body) clean(req.body);
    if (req.query) clean(req.query);
    if (req.params) clean(req.params);
    next();
};

// Use the new, correct middleware
app.use(sanitizeMongoInPlace);

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/reviews', reviewRoutes); 


const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => console.log(err));