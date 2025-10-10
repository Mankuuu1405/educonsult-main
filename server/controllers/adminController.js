import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js'; // <-- THIS IS THE FIX
import Booking from '../models/Booking.js';
import FacultyDetail from '../models/FacultyDetail.js'; // Ensure this is also imported
import Service from '../models/Service.js';
import mongoose from 'mongoose';
import Setting from '../models/Setting.js';
// @desc    Get dashboard overview statistics
// @route   GET /api/admin/stats
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

        // 1. Weekly Bookings (last 7 days)
        const weeklyBookings = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' }, // Group by day of the week (1=Sun, 2=Mon, ...)
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
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
    try {
        const facultyId = req.params.id;
        
        // 1. Get all services provided by this faculty
        const services = await Service.find({ faculty: facultyId }).lean(); // .lean() for a plain JS object

        // 2. For each service, count the number of completed bookings
        const servicesWithBookingCounts = await Promise.all(
            services.map(async (service) => {
                const bookingsCount = await Booking.countDocuments({
                    service: service._id,
                    status: 'completed'
                });
                return { ...service, bookingsCount };
            })
        );
        
        res.json({ services: servicesWithBookingCounts });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
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