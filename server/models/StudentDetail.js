import mongoose from 'mongoose';

const studentDetailSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student',
        unique: true,
    },
    profileImage: { type: String, default: '/default-avatar.png' },
    levelOfStudy: { type: String, default: '' },
    university: { type: String, default: '' },
    program: { type: String, default: '' }, // Field of Study / Major
    interestTags: { type: [String], default: [] }, // For the tag-style input
}, { timestamps: true });

const StudentDetail = mongoose.model('StudentDetail', studentDetailSchema);
export default StudentDetail;