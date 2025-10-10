import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    value: {
        type: String, // Stored as a string, can be parsed to number/boolean later
        required: true,
    },
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;