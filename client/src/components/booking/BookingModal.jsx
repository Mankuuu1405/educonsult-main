import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { X, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useToast } from '../../contexts/ToastContext';

const BookingModal = ({ isOpen, onClose, professor, services }) => {
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [studentDetails, setStudentDetails] = useState({ name: '', email: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const currencySymbols = { USD: '$', INR: '₹' };
    const { addToast } = useToast();



    // This effect loads the Razorpay script when the component mounts
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);


    useEffect(() => {
        // Pre-fill student details from localStorage if available
        const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        if (studentInfo) {
            setStudentDetails({ name: studentInfo.fullName, email: studentInfo.email });
        }

        // Animation logic for opening and closing the modal
        if (isOpen) {
            setCurrentStep(1);
            setSelectedService(null);
            document.body.style.overflow = 'hidden';
            gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
            gsap.fromTo(modalRef.current, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
        } else {
            gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
            gsap.to(modalRef.current, { y: 50, autoAlpha: 0, duration: 0.4, ease: "power3.in", onComplete: () => { document.body.style.overflow = 'auto'; } });
        }
    }, [isOpen]);

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setCurrentStep(2);
    };

    const handleBackToServices = () => setCurrentStep(1);

    // --- REVERTED: Handle Confirm Booking (No Payment) ---
    const handleConfirmBooking = async () => {
        const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        if (!studentInfo) {
            // alert('Please log in or sign up to book a session.');
            addToast('Please log in or sign up to book a session.', 'error');
            onClose();
            navigate('/student/login');
            return;
        }

        try {
            const { token } = studentInfo;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Call the free booking endpoint
            const { data } = await axiosInstance.post(`/api/bookings/create-free`, { serviceId: selectedService._id }, config);

            // alert(data.message); // "Booking confirmed successfully!"
            addToast(data.message, 'success');
            onClose();
            navigate('/student-dashboard'); // Redirect to dashboard to see the new booking

        } catch (error) {
            // Handle specific error from backend (e.g., already booked)
            // alert(error.response?.data?.message || 'Could not create booking. Please try again.');
            addToast(error.response?.data?.message || 'Could not create booking. Please try again.', 'error');
        }
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));

        if (!studentInfo) {
            addToast('Please log in to book a session.', 'error');
            onClose();
            navigate('/student/login');
            return;
        }

        try {
            // Step 1: Initiate payment and get order details from backend
            const { data: { success, order, key } } = await axiosInstance.post('/api/bookings/initiate-payment', {
                serviceId: selectedService._id
            });

            if (!success) {
                throw new Error('Failed to initiate payment.');
            }

            // Step 2: Configure and open Razorpay checkout
            const options = {
                key,
                amount: order.amount,
                currency: order.currency,
                name: 'Your App Name', // Replace with your app name
                description: `Booking: ${selectedService.title}`,
                image: professor?.profileImage || '/default-avatar.png',
                order_id: order.id,
                // Step 3: Handle payment verification via handler function
                handler: async (response) => {
                    try {
                        const verifyRes = await axiosInstance.post('/api/bookings/verify-payment', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            addToast(verifyRes.data.message, 'success');
                            onClose();
                            navigate('/student-dashboard');
                        } else {
                            throw new Error('Payment verification failed.');
                        }
                    } catch (err) {
                        addToast('Payment verification failed. Please contact support.', 'error');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: studentDetails.name,
                    email: studentDetails.email,
                },
                notes: {
                    serviceId: selectedService._id,
                    studentId: studentInfo.id,
                },
                theme: {
                    color: '#4f46e5', // Indigo color for the modal theme
                },
                modal: {
                    ondismiss: () => {
                        addToast('Payment was cancelled.', 'info');
                        setIsProcessing(false); // Re-enable button if modal is closed
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            addToast(error.response?.data?.message || 'Could not initiate payment. Please try again.', 'error');
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div ref={overlayRef} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b">
                    <div className="flex items-center">
                        {currentStep === 2 && (
                            <button onClick={handleBackToServices} className="p-1 mr-2 rounded-full hover:bg-gray-100"><ArrowRight size={24} className="rotate-180" /></button>
                        )}
                        <img src={professor?.profileImage || '/default-avatar.png'} alt={professor?.faculty?.fullName} className="w-10 h-10 rounded-full object-cover" />
                        <span className="ml-3 font-semibold">{professor?.faculty?.fullName}</span>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={24} /></button>
                </div>

                {/* Step 1: Select Service */}
                {currentStep === 1 && (
                    <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-4">
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary">Select a Service</h2>
                        {services && services.length > 0 ? (
                            services.map(service => (
                                <div key={service._id} className="bg-gray-50 rounded-lg p-4 border flex items-center justify-between hover:shadow-md">
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary">{service.title}</h3>
                                        <p className="text-sm text-text-secondary">{currencySymbols[service.currency]}{service.price.toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => handleServiceSelect(service)} className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-indigo-700">Select</button>
                                </div>
                            ))
                        ) : <p className="text-center py-8">No services available.</p>}
                    </div>
                )}

                {/* Step 2: Confirm Booking (Simplified) */}
                {currentStep === 2 && selectedService && (
                    <>
                        <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-6">
                            <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary">{selectedService.title}</h2>
                            {/* ... student details display ... */}
                            <div className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-primary">Total Price</h3>
                                <p className="font-bold text-2xl text-gray-800">₹{selectedService.price.toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-gray-600">You will be redirected to our secure payment partner to complete the booking. The chat session will be created immediately after successful payment.</p>
                        </div>
                        <div className="p-4 sm:p-5 bg-gray-50 border-t">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : `Proceed to Pay ₹${selectedService.price.toFixed(2)}`}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;