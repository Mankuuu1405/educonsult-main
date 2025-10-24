// /controllers/withdrawalController.js

import WithdrawalRequest from '../models/withdrawalRequestModel.js';
import FacultyWallet from '../models/withdrawalRequestModel.js'; // You need a wallet model

// @desc    Create a new withdrawal request
// @route   POST /api/faculty/withdrawals
// @access  Private/Faculty
export const createWithdrawalRequest = async (req, res) => {
    const { amount, currency, paymentDetails } = req.body;
    const facultyId = req.user._id;

    // --- CRITICAL: Server-side validation ---
    const wallet = await FacultyWallet.findOne({ faculty: facultyId });
    console.log(wallet);
    const balance = wallet.balances.find(b => b.currency === currency)?.amount || 0;

    if (amount <= 0 || !paymentDetails) {
        res.status(400);
        throw new Error('Invalid request data.');
    }
    if (balance < amount) {
        res.status(400);
        throw new Error('Insufficient funds.');
    }

    const request = await WithdrawalRequest.create({
        faculty: facultyId,
        amount,
        currency,
        paymentDetails
    });

    res.status(201).json(request);
};

// @desc    Get all pending withdrawal requests
// @route   GET /api/admin/withdrawals
// @access  Private/Admin
export const getPendingWithdrawals = async (req, res) => {
    const requests = await WithdrawalRequest.find({ status: 'pending' })
        .populate('faculty', 'fullName email profileImage'); // Populate with user details

    res.status(200).json(requests);
};

// @desc    Process a withdrawal request (approve/reject)
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
export const processWithdrawalRequest = async (req, res) => {
    const { status } = req.body; // Expecting 'approved' or 'rejected'
    const request = await WithdrawalRequest.findById(req.params.id);

    if (!request || request.status !== 'pending') {
        res.status(404);
        throw new Error('Request not found or already processed.');
    }

    if (status === 'approved') {
        // --- This is the most important step ---
        // Debit the amount from the faculty's available wallet balance
        const wallet = await FacultyWallet.findOne({ faculty: request.faculty });
        const balance = wallet.balances.find(b => b.currency === request.currency);
        
        if (!balance || balance.amount < request.amount) {
            throw new Error('Wallet balance is insufficient. Cannot approve.');
        }

        balance.amount -= request.amount;
        await wallet.save();

        // After successful debit, update the request status
        request.status = 'approved';
    } else if (status === 'rejected') {
        request.status = 'rejected';
        // If rejected, the money remains in their available balance. No wallet change needed.
    } else {
        res.status(400);
        throw new Error('Invalid status update.');
    }

    await request.save();
    res.status(200).json({ message: `Request has been ${status}.` });
};