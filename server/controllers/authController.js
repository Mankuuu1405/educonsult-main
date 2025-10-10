
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import crypto from 'crypto';
import Otp from '../models/Otp.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import { validationResult } from 'express-validator';
import validator from 'validator';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationOtp = async (email) => {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    await Otp.deleteMany({ email });
    await new Otp({ email, otp }).save();

    await transporter.sendMail({
        from: `CeTutor <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your CeTutor Verification Code',
        html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <style>
            :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
            }
            @media (prefers-color-scheme: dark) {
                .body-bg { background-color: #121212 !important; }
                .content-card { background-color: #1e1e1e !important; }
                .heading, .paragraph { color: #e0e0e0 !important; }
                .footer-text { color: #777777 !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; background-color: #f0f2f5;" class="body-bg">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" class="content-card">
                        <!-- Gradient Header -->
                        <tr>
                            <td align="center" style="padding: 20px; background-image: linear-gradient(to right, #4f46e5, #a855f7);">
                                <h1 style="font-size: 32px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -1px;">
                                    CeTutor
                                </h1>
                            </td>
                        </tr>
                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 5px;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center">
                                            <h2 style="font-size: 24px; font-weight: 600; color: #282828; margin: 0 0 15px 0;" class="heading">Your Secure Code</h2>
                                            <p style="font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 30px 0;" class="paragraph">Please use this one-time password to complete your sign-up process.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding: 0px 0;">
                                            <!-- The OTP -->
                                            <div style="font-size: 42px; font-weight: 700; letter-spacing: 8px; color: #4338ca; background-color: #eef2ff; padding: 20px 40px; border-radius: 8px; display: inline-block;">
                                                ${otp}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <p style="font-size: 14px; color: #888888; margin: 30px 0 0 0;" class="paragraph">This code is valid for 10 minutes.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                             <td align="center" style="padding: 30px 20px 30px 20px; border-top: 1px solid #e5e7eb;">
                                <p style="font-size: 12px; color: #9ca3af; margin: 0;" class="footer-text">
                                    &copy; ${new Date().getFullYear()} CeTutor. All Rights Reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `,
    });
};

// --- AUTHENTICATION LOGIC ---

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// This function will replace sending the token in the JSON body
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id, user.role);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
        httpOnly: true, // IMPORTANT: The cookie cannot be accessed by client-side JavaScript
          secure: process.env.NODE_ENV === 'production', // Must be true for SameSite='none'
        sameSite: 'none'
    };

    // Remove password from the user object before sending
    const userJson = user.toObject();
    delete userJson.password;

    res.status(statusCode)
        .cookie('token', token, options)
        .json(userJson); // Send back user details (without token)
};

// MODIFIED: registerFaculty
export const registerFaculty = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { fullName, email, password } = req.body;
        let faculty = await Faculty.findOne({ email });

        if (faculty && faculty.isVerified) {
            return res.status(400).json({ message: "A verified account with this email already exists." });
        }

        let role = email.endsWith('@webarclight.com') ? 'admin' : 'faculty';

        if (faculty && !faculty.isVerified) {
            faculty.password = password; // Re-hash will happen in pre-save hook
            faculty.fullName = fullName;
            faculty.role = role;
            await faculty.save();
        } else {
            faculty = await Faculty.create({ fullName, email, password, role, isVerified: false });
        }

        await sendVerificationOtp(email);
        res.status(201).json({ message: "Registration successful! Please check your email for a verification OTP." });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// MODIFIED: registerStudent
export const registerStudent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { fullName, email, password } = req.body;
        let student = await Student.findOne({ email });

        if (student && student.isVerified) {
            return res.status(400).json({ message: "A verified account with this email already exists." });
        }

        if (student && !student.isVerified) {
            student.password = password; // Re-hash will happen in pre-save hook
            student.fullName = fullName;
            await student.save();
        } else {
            student = await Student.create({ fullName, email, password, isVerified: false });
        }

        await sendVerificationOtp(email);
        res.status(201).json({ message: "Registration successful! Please check your email for a verification OTP." });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// NEW: verifyOtp controller
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }
        const normalizedEmail = validator.normalizeEmail(email, { gmail_remove_dots: false });
        const validOtp = await Otp.findOne({ email: normalizedEmail, otp });


        if (!validOtp) {
            console.error(`Verification failed: No valid OTP found for normalized email "${normalizedEmail}"`);
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        let user = await Faculty.findOne({ email: normalizedEmail }) || await Student.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.isVerified = true;
        await user.save();
        await Otp.deleteOne({ _id: validOtp._id });

        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(500).json({ message: "Server error during OTP verification." });
    }
};

// MODIFIED: loginFaculty
export const loginFaculty = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const faculty = await Faculty.findOne({ email }).select('+password');

        if (!faculty) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!faculty.isVerified) {
            await sendVerificationOtp(email);
            return res.status(403).json({ message: "Account not verified. A new OTP has been sent to your email.", needsVerification: true, email: email });
        }

        if (await faculty.matchPassword(password)) {
            sendTokenResponse(faculty, 200, res);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


// MODIFIED: loginStudent
export const loginStudent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email }).select('+password');

        if (!student) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!student.isVerified) {
            await sendVerificationOtp(email);
            return res.status(403).json({ message: "Account not verified. A new OTP has been sent to your email.", needsVerification: true, email: email });
        }

        if (await student.matchPassword(password)) {
            sendTokenResponse(student, 200, res);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Find the user in either collection
        const user = await Faculty.findOne({ email }) || await Student.findOne({ email });

        // SECURITY: Always send a success response to prevent email enumeration
        if (!user) {
            return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Save the token and expiry to the user's document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
        await user.save();

        // Create the reset URL for the frontend
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send the email
        await transporter.sendMail({
            from: `CeTutor <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'CeTutor Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>Password Reset Request</h2>
                    <p>You requested a password reset. Please click the link below to set a new password:</p>
                    <p><a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                    <p>This link will expire in one hour.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `,
        });

        res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });

    } catch (error) {
        // In case of a server error, we clear the token fields to be safe
        // This is an advanced step to prevent a user from being locked out if saving the token fails after generation
        const user = await Faculty.findOne({ email: req.body.email }) || await Student.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
        }
        res.status(500).json({ message: "Server error." });
    }
};


// --- NEW: RESET PASSWORD CONTROLLER ---
export const resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await Faculty.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        }) || await Student.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired." });
        }

        // Set the new password (the pre-save hook will hash it)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully. You can now log in." });

    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};