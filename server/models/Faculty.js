import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const facultySchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // Don't send password back in responses
    },
     role: {
        type: String,
        required: true,
        enum: ['faculty', 'admin'], // The role can only be one of these
        default: 'faculty',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String 
    },
    resetPasswordExpires: {
        type: Date 
    },
}, { timestamps: true });

// Middleware to hash password before saving the faculty document
facultySchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});

// Method to compare entered password with the hashed password
facultySchema.methods.matchPassword = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};

const Faculty = model('Faculty', facultySchema);

export default Faculty;