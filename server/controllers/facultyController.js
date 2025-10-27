import Faculty from '../models/Faculty.js';
import FacultyDetail from '../models/FacultyDetail.js';
import Booking from '../models/Booking.js';
import Setting from '../models/Setting.js';
import Review from '../models/Review.js';
import mongoose from 'mongoose';

// @desc    Get the logged-in faculty's profile details
// @route   GET /api/faculty/me/details
export const getFacultyDetails = async (req, res) => {
    try {
        const details = await FacultyDetail.findOne({ faculty: req.user._id });

        // Combine the non-sensitive main faculty info (name) with the details
        const profile = {
            fullName: req.user.fullName,
            email: req.user.email,
            ...(details?._doc || {}), // Spread the details document if it exists
        };

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create or update faculty profile details
// @route   PUT /api/faculty/me/details
// export const updateFacultyDetails = async (req, res) => {
//     try {
//         const { fullName, ...detailsData } = req.body;

//         // 1. Update the core Faculty model if fullName has changed
//         if (fullName && fullName !== req.user.fullName) {
//             await Faculty.findByIdAndUpdate(req.user._id, { fullName });
//         }

//         // 2. Use findOneAndUpdate with upsert to create or update the details
//         // upsert: true will create a new document if one doesn't match the query
//         const updatedDetails = await FacultyDetail.findOneAndUpdate(
//             { faculty: req.user._id }, // Find by the faculty ID link
//             { $set: detailsData }, // Set the new data
//             { new: true, upsert: true, setDefaultsOnInsert: true }
//         );

//         // Combine and send back the full, updated profile
//         const profile = {
//             fullName: fullName || req.user.fullName,
//             email: req.user.email,
//             ...updatedDetails._doc,
//         };

//         res.json(profile);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error: ' + error.message });
//     }
// };

export const updateFacultyDetails = async (req, res) => {
    try {
        console.log('=== UPDATE PROFILE REQUEST ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const { fullName, financials, ...otherDetails } = req.body;

        // 1. Update the core Faculty model if fullName has changed
        if (fullName && fullName !== req.user.fullName) {
            await Faculty.findByIdAndUpdate(req.user._id, { fullName });
        }

        // 2. Build update object - only include defined fields
        const updateData = {};
        
        // Add top-level fields if they exist
        if (otherDetails.title !== undefined) updateData.title = otherDetails.title;
        if (otherDetails.education !== undefined) updateData.education = otherDetails.education;
        if (otherDetails.bio !== undefined) updateData.bio = otherDetails.bio;
        if (otherDetails.address !== undefined) updateData.address = otherDetails.address;
        if (otherDetails.contactNumber !== undefined) updateData.contactNumber = otherDetails.contactNumber;
        if (otherDetails.profileImage !== undefined) updateData.profileImage = otherDetails.profileImage;
        if (otherDetails.expertiseTags !== undefined) updateData.expertiseTags = otherDetails.expertiseTags;
        if (otherDetails.isAvailable !== undefined) updateData.isAvailable = otherDetails.isAvailable;
        
        // Add financial fields with dot notation
        if (financials) {
            if (financials.payoutMethod !== undefined) {
                updateData['financials.payoutMethod'] = financials.payoutMethod;
            }
            if (financials.paypalEmail !== undefined) {
                updateData['financials.paypalEmail'] = financials.paypalEmail;
            }
            if (financials.bankAccountName !== undefined) {
                updateData['financials.bankAccountName'] = financials.bankAccountName;
            }
            if (financials.bankAccountNumber !== undefined) {
                updateData['financials.bankAccountNumber'] = financials.bankAccountNumber;
            }
            if (financials.bankRoutingNumber !== undefined) {
                updateData['financials.bankRoutingNumber'] = financials.bankRoutingNumber;
            }
            if (financials.bankIfscCode !== undefined) {
                updateData['financials.bankIfscCode'] = financials.bankIfscCode;
            }
            if (financials.branchName !== undefined) {
                updateData['financials.branchName'] = financials.branchName;
            }
        }

        console.log('Update data to be saved:', JSON.stringify(updateData, null, 2));

        // 3. Use findOneAndUpdate with upsert
        const updatedDetails = await FacultyDetail.findOneAndUpdate(
            { faculty: req.user._id },
            { $set: updateData },
            { 
                new: true, 
                upsert: true, 
                setDefaultsOnInsert: true,
                runValidators: false  // Changed to false to avoid validation issues
            }
        );

        console.log('Updated details from DB:', JSON.stringify(updatedDetails, null, 2));

        // Combine and send back the full, updated profile
        const profile = {
            fullName: fullName || req.user.fullName,
            email: req.user.email,
            ...updatedDetails._doc,
        };

        console.log('Sending response:', JSON.stringify(profile, null, 2));

        res.json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};



export const getAllFacultyProfiles = async (req, res) => {
    try {
        // Find all faculty members who are verified
        const faculties = await Faculty.find({ isVerified: true }).select('fullName email');

        // Find all details and populate the 'faculty' field with their name
        const profiles = await FacultyDetail.find({ faculty: { $in: faculties.map(f => f._id) } })
            .populate('faculty', 'fullName'); // This links the two collections

        res.json(profiles);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getFacultyProfileById = async (req, res) => {
    try {
        const facultyId = req.params.id;

        // 1. Fetch the main profile details
        const profile = await FacultyDetail.findOne({ faculty: facultyId })
            .populate('faculty', 'fullName email');

        if (!profile) {
            return res.status(404).json({ message: 'Faculty profile not found' });
        }

        // 2. Calculate total completed sessions
        const sessionsCount = await Booking.countDocuments({ 
            faculty: facultyId, 
            status: 'completed' 
        });

        // 3. Calculate average rating and review count using aggregation
        const reviewStats = await Review.aggregate([
            { $match: { faculty: new mongoose.Types.ObjectId(facultyId), isApproved: true } },
            { 
                $group: { 
                    _id: '$faculty',
                    averageRating: { $avg: '$rating' },
                    reviewsCount: { $sum: 1 }
                } 
            }
        ]);

        // Combine all data into a single response object
        const responseData = {
            ...profile.toObject(), // Convert mongoose doc to plain object
            stats: {
                sessionsCompleted: sessionsCount,
                averageRating: reviewStats[0]?.averageRating || 0,
                reviewsCount: reviewStats[0]?.reviewsCount || 0,
            }
        };

        res.json(responseData);

    } catch (error) {
        console.error("Error fetching single profile with stats:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
export const getFacultyDashboardStats = async (req, res) => {
    try {
        const facultyId = req.user._id;
        const feeSetting = await Setting.findOne({ key: 'platformFeePercentage' });
        const platformFee = feeSetting ? parseFloat(feeSetting.value) : 10; // Default 15%
        const PLATFORM_FEE_PERCENTAGE = platformFee / 100;


        const oneWeekAgo = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);

        // --- MODIFIED: Calculate Total Earnings per Currency ---
        const totalEarningsByCurrency = await Booking.aggregate([
            { $match: { faculty: facultyId, status: 'completed' } },
            { $group: { _id: '$currencyAtBooking', total: { $sum: '$priceAtBooking' } } }
        ]);

        // --- MODIFIED: Calculate Weekly Earnings per Currency ---
        const weeklyEarningsByCurrency = await Booking.aggregate([
            { $match: { faculty: facultyId, status: 'completed', createdAt: { $gte: oneWeekAgo } } },
            { $group: { _id: '$currencyAtBooking', total: { $sum: '$priceAtBooking' } } }
        ]);

        // --- MODIFIED: Calculate Wallet Balance per Currency ---
        const availableToWithdrawByCurrency = totalEarningsByCurrency.map(earning => ({
            currency: earning._id,
            amount: earning.total * (1 - PLATFORM_FEE_PERCENTAGE)
        }));

        // Fetch completed bookings for other stats
        const completedBookings = await Booking.find({ faculty: facultyId, status: 'completed' })
            .populate('student', 'fullName')
            .populate('service', 'title')
            .sort({ createdAt: -1 });

        const uniqueStudentsCount = new Set(completedBookings.map(b => b.student._id.toString())).size;
        const recentChatEarnings = completedBookings.slice(0, 5).map(b => ({
            id: b._id, student: b.student.fullName, topic: b.service.title,
            earnings: b.priceAtBooking, currency: b.currencyAtBooking, date: b.createdAt,
        }));

        res.json({
            totalEarnings: totalEarningsByCurrency,
            weeklyEarnings: weeklyEarningsByCurrency,
            availableToWithdraw: availableToWithdrawByCurrency,
            completedChats: completedBookings.length,
            uniqueStudents: uniqueStudentsCount,
            averageRating: 4.9, // Placeholder
            recentChatEarnings,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

export const getProfileStatus = async (req, res) => {
    try {
        const details = await FacultyDetail.findOne({ faculty: req.user._id });

        if (!details) {
            return res.json({ isComplete: false, message: 'Profile details not found.' });
        }

        // Define which fields are mandatory for a "complete" profile
        const requiredFields = ['title', 'education', 'bio', 'profileImage'];
        const missingFields = requiredFields.filter(field => !details[field]);

        if (missingFields.length > 0) {
            return res.json({ isComplete: false, message: `Profile is missing: ${missingFields.join(', ')}` });
        }

        if (!details.expertiseTags || details.expertiseTags.length === 0) {
            return res.json({ isComplete: false, message: 'Profile must have at least one expertise tag.' });
        }

        // Check financial details based on selected method
        const { financials } = details;
        if (!financials || !financials.payoutMethod) {
            return res.json({ isComplete: false, message: 'Payout method is not selected.' });
        }
        // if (financials.payoutMethod === 'paypal' && !financials.paypalEmail) {
        //     return res.json({ isComplete: false, message: 'PayPal email is required.' });
        // }
        if (financials.payoutMethod === 'bank' && (!financials.bankAccountName || !financials.bankAccountNumber || !financials.bankIfscCode)) {
            return res.json({ isComplete: false, message: 'Complete bank details are required.' });
        }

        res.json({ isComplete: true });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};