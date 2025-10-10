import mongoose from 'mongoose';

const facultyDetailSchema = new mongoose.Schema({
    // This creates a one-to-one link with the main Faculty model.
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Faculty',
        unique: true, // Ensures one profile per faculty
    },
    title: { type: String, default: '' },
    education: { type: String, default: '' },
    bio: { type: String, default: '' },
    expertiseTags: { type: [String], default: [] },
     isAvailable: {
        type: Boolean,
        default: false, // Default to offline for safety
    },

    profileImage: { type: String, default: '/default-avatar.png' }, // Store as a URL or base64 string
    
    financials: {
        payoutMethod: { type: String, enum: ['paypal', 'bank'], default: 'paypal' },
        paypalEmail: { type: String, default: '' },
        bankAccountName: { type: String, default: '' },
        bankAccountNumber: { type: String, default: '' },
        bankRoutingNumber: { type: String, default: '' },
        bankIfscCode: { type: String, default: '' }, // New field
    },
}, { timestamps: true });

const FacultyDetail = mongoose.model('FacultyDetail', facultyDetailSchema);
export default FacultyDetail;