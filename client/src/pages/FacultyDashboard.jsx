import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useLocation } from 'react-router-dom';
// Component Imports
import SidebarF from '../components/FacultyDashboard/SidebarF';
import MainContentF from '../components/FacultyDashboard/MainContentF';
import EditProfileF from '../components/FacultyDashboard/EditProfileF';
import ServicesManagerF from '../components/FacultyDashboard/ServicesManagerF';
import ShowBookings from '../components/FacultyDashboard/ShowBookings';
import MyChatF from '../components/FacultyDashboard/MyChatF';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'; // Keep these for the mobile header button
import { gsap } from 'gsap';
import { useToast } from '../contexts/ToastContext';
import LoadingAnimation from '../components/ui/LoadingAnimation';

const FacultyDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');
    const contentRef = useRef(null);
    const [allBookings, setAllBookings] = useState([]);
    const [activeChatSession, setActiveChatSession] = useState(null);
    const location = useLocation();
     const { addToast } = useToast();

    // --- STATE MANAGEMENT FOR PROFILE DATA ---
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    const getSessionForBooking = useCallback(async (booking) => {
        if (!booking) return null;
        try {
            const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data: session } = await axiosInstance.post(`/api/chat/session`, { bookingId: booking._id }, config);
            return session;
        } catch (error) {
            console.error("Could not get chat session.", error);
            // alert("Could not start chat session. Please try again.");
            addToast("Could not start chat session. Please try again.", "error");
            return null;
        }
    }, [API_URL]);
    useEffect(() => {
        if (location.state?.defaultView) {
            setActiveView(location.state.defaultView);
        }
    }, [location.state]);
    // --- FETCH ALL NECESSARY DATA ONCE ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const userInfo = JSON.parse(localStorage.getItem('facultyInfo'));
                if (!userInfo) {
                    setError("Not authorized. Please log in again.");
                    setLoading(false);
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // Fetch bookings and profile details in parallel
                const bookingsPromise = axiosInstance.get(`/api/bookings/my-faculty-bookings`, config);
                const profilePromise = axiosInstance.get(`/api/faculty/me/details`, config);

                const [bookingsRes, profileRes] = await Promise.all([bookingsPromise, profilePromise]);

                setAllBookings(bookingsRes.data);
                setProfileData(profileRes.data);
            } catch (error) {
                console.error("Failed to fetch initial dashboard data:", error);
                setError(error.response?.data?.message || 'Failed to fetch initial data.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [API_URL]);


    // Animate content on view change
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
        }
    }, [activeView]);

    // --- THE FIX for direct navigation to chat ---
    useEffect(() => {
        if (activeView === 'live-chat' && !activeChatSession && allBookings.length > 0) {
            // If we land on the chat page without a selected session, pick the first one.
            const activateFirstChat = async () => {
                const session = await getSessionForBooking(allBookings[0]);
                if (session) setActiveChatSession(session);
            };
            activateFirstChat();
        }
    }, [activeView, activeChatSession, allBookings, getSessionForBooking]);

    // --- HANDLE PROFILE SAVE/UPDATE ---
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!profileData.expertiseTags || profileData.expertiseTags.length === 0) {
            // alert('Please add at least one area of expertise.');
            addToast('Please add at least one area of expertise.', 'error');
            return;
        }
        try {
            const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axiosInstance.put(`/api/faculty/me/details`, profileData, config);

            // Update state with confirmed data from server to keep UI in sync
            setProfileData(data);

            addToast('Profile updated successfully!', 'success');

        } catch (err) {
            addToast('Error: Could not update profile. ' + (err.response?.data?.message || err.message), 'error');
        }
    };

    // Handler for "Join Chat" button or clicking a chat in the list
    const handleChatSelect = async (booking) => {
        const session = await getSessionForBooking(booking);
        if (session) {
            setActiveChatSession(session);
            setActiveView('live-chat'); // Ensure view is switched if not already
        }
    };

    const renderContent = () => {
        if (loading) return <LoadingAnimation />;
        if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

        switch (activeView) {
            case 'profile':
                return <EditProfileF
                    profileData={profileData}
                    setProfileData={setProfileData}
                    onSubmit={handleProfileSubmit}
                />;
            case 'services':
                return <ServicesManagerF />;
            case 'bookings':
                return <ShowBookings onJoinChat={handleChatSelect} />;
            case 'live-chat':
                return <MyChatF
                    bookings={allBookings}
                    onChatSelect={handleChatSelect}
                    activeSession={activeChatSession}
                />;
            default:
                return <MainContentF onNavigate={setActiveView} />;
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="flex h-screen">
                {/* Desktop Sidebar (visible on large screens and up) */}
                <div className="hidden lg:block lg:w-64 flex-shrink-0">
                    <SidebarF
                        activeView={activeView}
                        onNavigate={setActiveView}
                        profileData={profileData}
                    />
                </div>

                {/* Mobile Sidebar (Fixed positioning and animation handled here) */}
                <div className={`
                    fixed inset-y-0 left-0 w-64 h-full z-50
                    transform transition-transform duration-300 ease-in-out
                    lg:hidden
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <SidebarF
                        activeView={activeView}
                        onNavigate={(view) => {
                            setActiveView(view);
                            setIsSidebarOpen(false); // Close sidebar after navigation
                        }}
                        profileData={profileData}
                    // SidebarF doesn't use isMobileOpen/setMobileOpen as per your latest code
                    />
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Mobile Header (visible on screens smaller than large) */}
                    <header className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-700">Faculty Panel</h2>
                        {/* Mobile Sidebar Toggle Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggles sidebar open/close
                            className="p-2 rounded-md hover:bg-slate-100" // Added rounded-md and hover styles
                            aria-label={isSidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
                        >
                            {/* Shows X when sidebar is open, Hamburger when closed */}
                            {isSidebarOpen ? <XMarkIcon className="h-6 w-6 text-slate-800" /> : <Bars3Icon className="h-6 w-6 text-slate-800" />}
                        </button>
                    </header>
                    <main ref={contentRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                        {renderContent()}
                    </main>
                </div>

                {/* Mobile Sidebar Overlay (Also handled here) */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" // z-40 so it's below sidebar (z-50) but above content
                    ></div>
                )}
            </div>
        </div>
    );
};

export default FacultyDashboard;