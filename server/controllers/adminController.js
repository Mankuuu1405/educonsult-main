import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js'; // <-- THIS IS THE FIX
import Booking from '../models/Booking.js';
import FacultyDetail from '../models/FacultyDetail.js'; 
import Service from '../models/Service.js';
import mongoose from 'mongoose';
import Setting from '../models/Setting.js';
import { json } from 'express';
import ExcelJS from 'exceljs';

export const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ isVerified: true });
        const totalFaculty = await Faculty.countDocuments({ isVerified: true });
        const totalBookings = await Booking.countDocuments({ status: 'completed' });
        const setting=await Setting.find({});
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
            monthlySignups,
            setting
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



export const getSettings = async (req, res) => {
    
    try {
        let settings = await Setting.findOne();
        // If no settings exist, create a default document
        if (!settings) {
            settings = await new Setting().save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { platformFeePercentage, payoutDate } = req.body;

        // Use findOneAndUpdate with upsert:true.
        // This finds the first document and updates it, or creates it if it doesn't exist.
        const updatedSettings = await Setting.findOneAndUpdate(
            {}, // An empty filter will match the first document
            { platformFeePercentage, payoutDate },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        console.log(updateSettings);

        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// export const exportPayments = async (req, res) => {
//     try {
//         console.log('Export payments requested by:', req.user.email);
        
//         // 1. Get platform fee percentage from settings
//         const settings = await Setting.findOne();
//         const platformFeePercentage = settings?.platformFeePercentage || 30;
//         const payoutDate = settings?.payoutDate;

//         // 2. Get all completed bookings for this month
//         const startOfMonth = new Date();
//         startOfMonth.setDate(1);
//         startOfMonth.setHours(0, 0, 0, 0);

//         const endOfMonth = new Date();
//         endOfMonth.setMonth(endOfMonth.getMonth() + 1);
//         endOfMonth.setDate(0);
//         endOfMonth.setHours(23, 59, 59, 999);

//         console.log('Fetching bookings from', startOfMonth.toLocaleDateString(), 'to', endOfMonth.toLocaleDateString());

//         const bookings = await Booking.find({
//             status: 'completed',
//             paymentStatus: 'successful',
//             createdAt: { $gte: startOfMonth, $lte: endOfMonth }
//         }).populate('faculty');

//         console.log('Found', bookings.length, 'completed bookings');

//         // 3. Group bookings by faculty and calculate totals
//         const facultyPayments = {};

//         for (const booking of bookings) {
//             const facultyId = booking.faculty._id.toString();
            
//             if (!facultyPayments[facultyId]) {
//                 facultyPayments[facultyId] = {
//                     facultyId: facultyId,
//                     facultyName: booking.faculty.fullName,
//                     email: booking.faculty.email,
//                     totalRevenue: 0,
//                     platformFee: 0,
//                     payoutAmount: 0,
//                     bookingCount: 0,
//                     currency: booking.currencyAtBooking
//                 };
//             }

//             // Calculate payment after platform fee
//             const revenueAmount = booking.priceAtBooking;
//             const feeAmount = (revenueAmount * platformFeePercentage) / 100;
//             const payoutAmount = revenueAmount - feeAmount;

//             facultyPayments[facultyId].totalRevenue += revenueAmount;
//             facultyPayments[facultyId].platformFee += feeAmount;
//             facultyPayments[facultyId].payoutAmount += payoutAmount;
//             facultyPayments[facultyId].bookingCount += 1;
//         }

//         console.log('Processed payments for', Object.keys(facultyPayments).length, 'faculty members');

//         // 4. Fetch faculty financial details
//         const facultyIds = Object.keys(facultyPayments);
//         const facultyDetails = await FacultyDetail.find({
//             faculty: { $in: facultyIds }
//         });

//         // Create a map for quick lookup
//         const detailsMap = {};
//         facultyDetails.forEach(detail => {
//             detailsMap[detail.faculty.toString()] = detail;
//         });

//         // 5. Create Excel workbook
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Faculty Payments');

//         worksheet.getCell('A1').value = 'Monthly Faculty Payment Report';
//         worksheet.getCell('A1').font = { size: 16, bold: true };

//         // Define columns
//         worksheet.columns = [
//             { header: 'Faculty Name', key: 'name', width: 25 },
//             { header: 'Email', key: 'email', width: 30 },
//             { header: 'Contact Number', key: 'contactNumber', width: 15 },
//             { header: 'Address', key: 'address', width: 40 },
//             { header: 'Branch Name', key: 'branchName', width: 20 },
//             { header: 'Bookings Count', key: 'bookingCount', width: 15 },
//             { header: 'Payout Amount', key: 'payoutAmount', width: 15 },
//             { header: 'Currency', key: 'currency', width: 10 },
//             { header: 'Payout Method', key: 'payoutMethod', width: 15 },
//             { header: 'PayPal Email', key: 'paypalEmail', width: 30 },
//             { header: 'Bank Account Name', key: 'bankAccountName', width: 25 },
//             { header: 'Bank Account Number', key: 'bankAccountNumber', width: 20 },
//             { header: 'Bank Routing Number', key: 'bankRoutingNumber', width: 20 },
//             { header: 'Bank IFSC Code', key: 'bankIfscCode', width: 15 }
//         ];

//         // Style header row
//         const headerRow = worksheet.getRow(6);
//         headerRow.font = { bold: true };
//         headerRow.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'FFE0E0E0' }
//         };

//         // Add data rows
//         for (const [facultyId, payment] of Object.entries(facultyPayments)) {
//             const details = detailsMap[facultyId];
            
//             worksheet.addRow({
//                 name: payment.facultyName,
//                 email: payment.email,
//                 contactNumber: details?.contactNumber || 'N/A',
//                 address: details?.address || 'N/A',
//                 branchName: details?.branchName || 'N/A',
//                 bookingCount: payment.bookingCount,
//                 payoutAmount: payment.payoutAmount.toFixed(2),
//                 currency: payment.currency,
//                 payoutMethod: details?.financials?.payoutMethod || 'Not Set',
//                 paypalEmail: details?.financials?.paypalEmail || 'N/A',
//                 bankAccountName: details?.financials?.bankAccountName || 'N/A',
//                 bankAccountNumber: details?.financials?.bankAccountNumber || 'N/A',
//                 bankRoutingNumber: details?.financials?.bankRoutingNumber || 'N/A',
//                 bankIfscCode: details?.financials?.bankIfscCode || 'N/A'
//             });
//         }

//         if (Object.keys(facultyPayments).length === 0) {
//             // Add a message if no payments
//             worksheet.addRow({
//                 name: 'No completed bookings for this month',
//                 email: '',
//                 bookingCount: '',
//                 totalRevenue: '',
//                 platformFee: '',
//                 payoutAmount: '',
//                 currency: '',
//                 payoutMethod: '',
//                 paypalEmail: '',
//                 bankAccountName: '',
//                 bankAccountNumber: '',
//                 bankRoutingNumber: '',
//                 bankIfscCode: ''
//             });
//         }

//         // Generate buffer
//         const buffer = await workbook.xlsx.writeBuffer();

//         // Set response headers
//         const filename = `Faculty_Payments_${startOfMonth.toISOString().slice(0, 7)}.xlsx`;
//         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
//         console.log('Sending file:', filename);
        
//         // Send the file
//         res.send(buffer);

//     } catch (error) {
//         console.error('Error generating payment export:', error);
//         res.status(500).json({ 
//             success: false, 
//             message: 'Failed to generate payment report',
//             error: error.message 
//         });
//     }
// };


export const exportPayments = async (req, res) => {
    try {
        console.log('Export payments requested by:', req.user.email);
        
        // 1. Get platform fee percentage from settings
        const settings = await Setting.findOne();
        const platformFeePercentage = settings?.platformFeePercentage || 30;
        const payoutDate = settings?.payoutDate;

        // 2. Get all completed bookings for this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        console.log('Fetching bookings from', startOfMonth.toLocaleDateString(), 'to', endOfMonth.toLocaleDateString());

        const bookings = await Booking.find({
            status: 'completed',
            paymentStatus: 'successful',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).populate('faculty');

        console.log('Found', bookings.length, 'completed bookings');

        // 3. Group bookings by faculty and calculate totals
        const facultyPayments = {};

        for (const booking of bookings) {
            const facultyId = booking.faculty._id.toString();
            
            if (!facultyPayments[facultyId]) {
                facultyPayments[facultyId] = {
                    facultyId: facultyId,
                    facultyName: booking.faculty.fullName,
                    email: booking.faculty.email,
                    totalRevenue: 0,
                    platformFee: 0,
                    payoutAmount: 0,
                    bookingCount: 0,
                    currency: booking.currencyAtBooking
                };
            }

            // Calculate payment after platform fee
            const revenueAmount = booking.priceAtBooking;
            const feeAmount = (revenueAmount * platformFeePercentage) / 100;
            const payoutAmount = revenueAmount - feeAmount;

            facultyPayments[facultyId].totalRevenue += revenueAmount;
            facultyPayments[facultyId].platformFee += feeAmount;
            facultyPayments[facultyId].payoutAmount += payoutAmount;
            facultyPayments[facultyId].bookingCount += 1;
        }

        console.log('Processed payments for', Object.keys(facultyPayments).length, 'faculty members');

        // 4. Fetch faculty financial details
        const facultyIds = Object.keys(facultyPayments);
        const facultyDetails = await FacultyDetail.find({
            faculty: { $in: facultyIds }
        });

        // Create a map for quick lookup
        const detailsMap = {};
        facultyDetails.forEach(detail => {
            detailsMap[detail.faculty.toString()] = detail;
        });

        // 5. Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Faculty Payments');

        // Add title in row 1
        worksheet.getCell('A1').value = 'Monthly Faculty Payment Report';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        
        // Add empty row for spacing (row 2 will be empty)
        worksheet.addRow([]);

        // Define columns (this will create row 3 as the header)
        worksheet.columns = [
            { header: 'Faculty Name', key: 'name', width: 25 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Contact Number', key: 'contactNumber', width: 15 },
            { header: 'Address', key: 'address', width: 40 },
            { header: 'Branch Name', key: 'branchName', width: 20 },
            { header: 'Bookings Count', key: 'bookingCount', width: 15 },
            { header: 'Payout Amount', key: 'payoutAmount', width: 15 },
            { header: 'Currency', key: 'currency', width: 10 },
            { header: 'Payout Method', key: 'payoutMethod', width: 15 },
            { header: 'PayPal Email', key: 'paypalEmail', width: 30 },
            { header: 'Account Holder Name', key: 'bankAccountName', width: 25 },
            { header: 'Bank Account Number', key: 'bankAccountNumber', width: 20 },
            { header: 'Bank Routing Number', key: 'bankRoutingNumber', width: 20 },
            { header: 'Bank IFSC Code', key: 'bankIfscCode', width: 15 }
        ];

        // Style header row (row 3 after title and empty row)
        const headerRow = worksheet.getRow(3);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        // Add data rows
        for (const [facultyId, payment] of Object.entries(facultyPayments)) {
            const details = detailsMap[facultyId];
            
            worksheet.addRow({
                name: payment.facultyName,
                email: payment.email,
                contactNumber: details?.contactNumber || 'N/A',
                address: details?.address || 'N/A',
                bookingCount: payment.bookingCount,
                payoutAmount: payment.payoutAmount.toFixed(2),
                currency: payment.currency,
                payoutMethod: details?.financials?.payoutMethod || 'Not Set',
                paypalEmail: details?.financials?.paypalEmail || 'N/A',
                bankAccountName: details?.financials?.bankAccountName || 'N/A',
                bankAccountNumber: details?.financials?.bankAccountNumber || 'N/A',
                bankRoutingNumber: details?.financials?.bankRoutingNumber || 'N/A',
                bankIfscCode: details?.financials?.bankIfscCode || 'N/A',
                branchName: details?.financials?.branchName || 'N/A',
            });
        }

        // Add message if no payments found
        if (Object.keys(facultyPayments).length === 0) {
            worksheet.addRow({
                name: 'No completed bookings for this month',
                email: '',
                contactNumber: '',
                address: '',
                branchName: '',
                bookingCount: '',
                payoutAmount: '',
                currency: '',
                payoutMethod: '',
                paypalEmail: '',
                bankAccountName: '',
                bankAccountNumber: '',
                bankRoutingNumber: '',
                bankIfscCode: ''
            });
        }

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set response headers
        const filename = `Faculty_Payments_${startOfMonth.toISOString().slice(0, 7)}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        console.log('Sending file:', filename);
        
        // Send the file
        res.send(buffer);

    } catch (error) {
        console.error('Error generating payment export:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to generate payment report',
            error: error.message 
        });
    }
};