import StudentDetail from '../models/StudentDetail.js';
// @desc Get the logged-in student's profile details
export const getStudentDetails = async (req, res) => {
try {
const details = await StudentDetail.findOne({ student: req.user._id });
const profile = {
fullName: req.user.fullName,
email: req.user.email,
...(details?._doc || {}),
};
res.json(profile);
} catch (error) {
res.status(500).json({ message: 'Server Error' });
}
};
// @desc Create or update student profile details
export const updateStudentDetails = async (req, res) => {
try {
const { fullName, email, ...detailsData } = req.body;
    // Note: We don't update fullName or email here as they are fixed
    
    const updatedDetails = await StudentDetail.findOneAndUpdate(
        { student: req.user._id },
        { $set: detailsData },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const profile = {
        fullName: req.user.fullName,
        email: req.user.email,
        ...updatedDetails._doc,
    };
    res.json(profile);
} catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
}
};