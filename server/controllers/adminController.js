import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js'; // <-- THIS IS THE FIX
import Booking from '../models/Booking.js';
import FacultyDetail from '../models/FacultyDetail.js'; 
import Service from '../models/Service.js';
import mongoose from 'mongoose';
import Setting from '../models/Setting.js';
import { json } from 'express';

export const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ isVerified: true });
        const totalFaculty = await Faculty.countDocuments({ isVerified: true });
        const totalBookings = await Booking.countDocuments({ status: 'completed' });

         const revenueByCurrency = await Booking.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: '$currencyAtBooking', // Group by the currency (e.g., 'USD', 'INR')
                    total: { $sum: '$priceAtBooking' }
                }
            }
        ]);

        // --- Chart Data ---

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 1. Weekly Bookings (last 7 days)
        const weeklyBookings = await Booking.aggregate([
                   {
            $match: {
                createdAt: { $gte: sevenDaysAgo }
            }
        },
        // Step 2: Group documents by the day of the week and count them
        {
            $group: {
                // $dayOfWeek returns a number (1=Sun, 2=Mon, ..., 7=Sat)
                _id: { $dayOfWeek: '$createdAt' },
                count: { $sum: 1 }
            }
        },
        // Step 3: Sort by day of the week for consistency
        {
            $sort: { _id: 1 }
        }

        ]);
        
        // 2. Monthly Student Signups (last 6 months)
        const monthlySignups = await Student.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
                    isVerified: true
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' }, // Group by month (1=Jan, 2=Feb, ...)
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        

        res.json({
            totalStudents,
            totalFaculty,
            totalBookings,
            revenueByCurrency, 
            weeklyBookings,
            monthlySignups
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

export const getFacultyList = async (req, res) => {
    try {
        const facultyProfiles = await FacultyDetail.find({})
            .populate('faculty', 'fullName email'); // This will now work correctly

        res.json(facultyProfiles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// --- NEW FUNCTION ---
// @desc    Get detailed info for a single faculty (services and booking counts)
// @route   GET /api/admin/faculty/:id/details
export const getFacultyDetailsForAdmin = async (req, res) => {
    
  const facultyDetailId = req.params._id;

    // Step 1: Fetch the core faculty details
    // Use .lean() to get a plain JavaScript object, which is faster and easier to modify
    const facultyDetails = await FacultyDetail.findById(facultyDetailId)
        .populate('faculty', 'fullName email')
        .lean();

    if (!facultyDetails) {
        res.status(404);
        throw new Error('Faculty not found');
    }

    // Step 2: Count the total bookings for this faculty member
    // We use the main faculty ID (faculty._id) to match against the booking records.
    const totalBookings = await Booking.countDocuments({ faculty: facultyDetails.faculty._id });

    // Step 3: Combine the details and the booking count into a single response object
    const responseData = {
        ...facultyDetails,
        totalBookings: totalBookings, // Add the new property here
    };

    res.status(200).json(responseData);
};

export const getPlatformFee = async (req, res) => {
    try {
        const feeSetting = await Setting.findOne({ key: 'platformFeePercentage' });
        const fee = feeSetting ? parseFloat(feeSetting.value) : 10;
        res.json({ platformFeePercentage: fee });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW FUNCTION ---
// @desc    Update the platform fee
// @route   PUT /api/admin/settings/platform-fee
export const setPlatformFee = async (req, res) => {
    try {
        const { percentage } = req.body;
        if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
            return res.status(400).json({ message: 'Invalid percentage value.' });
        }
        
        const updatedSetting = await Setting.findOneAndUpdate(
            { key: 'platformFeePercentage' },
            { value: percentage.toString() },
            { new: true, upsert: true }
        );
        res.json({ message: 'Platform fee updated successfully.', setting: updatedSetting });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

//Delete functionality for faculty
export const deleteFaculty = async (req, res) => {
    
    const facultyDetailId = req.params._id;
   

    // Find the faculty profile to get the associated user ID
    try{
        const facultyDetail = await FacultyDetail.findById(facultyDetailId);

    if (!facultyDetail) {
        res.status(404);
        throw new Error('Faculty profile not found.');
    }

    const userId = facultyDetail.faculty; // Get the ID of the main user account

    // Delete the FacultyDetail document
   
    // If a user is associated, delete the main User document as well
    if (userId) {
        await FacultyDetail.deleteOne({ _id: facultyDetailId });
        await Faculty.deleteOne({ _id: userId });
        
    }
    

    // Optional Cleanup: You could also delete related bookings, services, etc.
    // For example: await Booking.deleteMany({ faculty: userId });
    return res.status(200).json({ message: 'Faculty member and associated user account deleted successfully.' });


    }catch (e){
        return res.status(500).json({message:"Internal Server Error"});
    }
    
    
};
//to update the faculty

export const updateFaculty = async (req, res) => {
    const facultyDetailId = req.params.id;
    const { fullName, email, title, expertiseTags, isAvailable } = req.body;

    const facultyDetail = await FacultyDetail.findById(facultyDetailId);

    if (!facultyDetail) {
        res.status(404);
        throw new Error('Faculty profile not found.');
    }

    // Find the associated User to update name and email
    const user = await Faculty.findById(facultyDetail.faculty);
    if (user) {
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        await user.save();
    }

    // Update the FacultyDetail document
    facultyDetail.title = title || facultyDetail.title;
    // Ensure expertiseTags is handled as an array
    facultyDetail.expertiseTags = expertiseTags || facultyDetail.expertiseTags; 
    // Handle the boolean isAvailable status
    if (isAvailable !== undefined) {
        facultyDetail.isAvailable = isAvailable;
    }
    
    const updatedFacultyDetail = await facultyDetail.save();

    // Populate the updated document to send back the full object
    const populatedResult = await FacultyDetail.findById(updatedFacultyDetail._id)
                                                .populate('faculty', 'fullName email');

    res.status(200).json(populatedResult);
};