import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const studentSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        required: true,
        default: 'student',
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

// Add password hashing and matching methods (similar to Faculty model)
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};

const Student = model('Student', studentSchema);

export default Student;