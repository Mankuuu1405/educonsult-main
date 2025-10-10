import React, { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../api/axios';

// 1. Import all the components it needs to be able to show
import Sidebar from '../components/Studentdashboard/Sidebar';
import Booking from '../components/Studentdashboard/Booking';
import EditProfile from '../components/Studentdashboard/EditProfile';
import MyChat from '../components/Studentdashboard/MyChat';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { gsap } from 'gsap';
import LoadingAnimation from '../components/ui/LoadingAnimation';
import { useToast } from '../contexts/ToastContext';


const StudentDashboardPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // This state now controls which view is visible
    const [activeView, setActiveView] = useState('booking'); // Default to 'booking' view

    // State to manage data across components
    const [allBookings, setAllBookings] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [activeChatSession, setActiveChatSession] = useState(null);
    const [loading, setLoading] = useState(true);
      const { addToast } = useToast(); 

    const contentRef = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    // --- 1. Fetch all necessary data on initial load ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const { token } = JSON.parse(localStorage.getItem('studentInfo'));
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch bookings and profile details in parallel for efficiency
                const bookingsPromise = axiosInstance.get('/api/bookings/my-bookings', config);
                const profilePromise = axiosInstance.get('/api/students/me/details', config);

                const [bookingsRes, profileRes] = await Promise.all([bookingsPromise, profilePromise]);

                setAllBookings(bookingsRes.data);
                setProfileData(profileRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [API_URL]);

    // --- 2. Animate content when the view changes ---
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        }
    }, [activeView]);

    // --- 3. Logic to get or create a chat session ---
    const getSessionForBooking = useCallback(async (booking) => {
        if (!booking) return null;
        try {
            const { token } = JSON.parse(localStorage.getItem('studentInfo'));
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data: session } = await axiosInstance.post('/api/chat/session', { bookingId: booking._id }, config);
            return session;
        } catch (error) {
            // alert("Could not start chat session. Please try again.");
            addToast("Could not start chat session. Please try again.", "error");
            return null;
        }
    }, [API_URL]);

    // --- 4. Handle "Join Chat" button clicks and direct navigation ---
    const handleChatSelect = useCallback(async (booking) => {
        const session = await getSessionForBooking(booking);
        if (session) {
            setActiveChatSession(session);
            setActiveView('chat'); // Switch view to chat
        }
    }, [getSessionForBooking]);

    // This handles clicking "My Chats" directly from the sidebar
    useEffect(() => {
        if (activeView === 'chat' && !activeChatSession && allBookings.length > 0) {
            handleChatSelect(allBookings[0]);
        }
    }, [activeView, activeChatSession, allBookings, handleChatSelect]);

    // --- 5. This function decides which component to render ---
    const renderContent = () => {
        if (loading) {
            return <LoadingAnimation />;
        }

        switch (activeView) {
            case 'chat':
                return <MyChat
                    bookings={allBookings}
                    onChatSelect={handleChatSelect}
                    activeSession={activeChatSession}
                />;
            case 'booking':
                return <Booking
                    bookings={allBookings}
                    onJoinChat={handleChatSelect} // "Join Chat" button uses the same logic
                />;
            case 'profile':
                return <EditProfile />; // EditProfile fetches its own data, which is fine
            default:
                // Default to the booking page
                return <Booking bookings={allBookings} onJoinChat={handleChatSelect} />;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="flex h-screen">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                    <Sidebar
                        activeView={activeView}
                        onNavigate={setActiveView}
                        profileData={profileData} // Pass profile data to sidebar
                    />
                </div>

                {/* Mobile Sidebar */}
                <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="w-64 h-full">
                        <Sidebar
                            activeView={activeView}
                            profileData={profileData} // Pass profile data here too
                            onNavigate={(view) => {
                                setActiveView(view);
                                setIsSidebarOpen(false);
                            }}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-700">Student Portal</h2>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-slate-100">
                            {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </button>
                    </header>

                    <main ref={contentRef} className="flex-1 overflow-x-hidden overflow-y-auto">
                        {renderContent()}
                    </main>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"></div>}
        </div>
    );
};

export default StudentDashboardPage;