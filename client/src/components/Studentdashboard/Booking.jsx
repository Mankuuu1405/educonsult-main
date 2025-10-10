import React, { useEffect, useRef, useState } from 'react';
import { CalendarCheck, Video, History, PlusCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';


// --- Main Booking Page Component ---
const Booking = ({ onJoinChat, bookings=[]}) => {
   const mainRef = useRef(null);
    const [showPast, setShowPast] = useState(false);
    const [pastSessionsData, setPastSessionsData] = useState([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".animate-on-load", {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15
        });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div ref={mainRef} className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
      <header className="mb-10">
                <h1 className="text-4xl font-bold text-gray-800">My Bookings</h1>
                <p className="text-gray-500 mt-1">Manage your upcoming and past live chat sessions.</p>
            </header>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800">Upcoming Sessions</h2>
                        <div className="space-y-4 mt-4">
                            {bookings.length > 0 ? (
                                bookings.map(session => (
                                    <div key={session._id} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{session.service?.title || 'Service Title'}</p>
                                            <p className="text-sm text-gray-500">with {session.faculty?.fullName || 'Faculty Name'}</p>
                                        </div>
                                        {/* This button now calls the parent's handler */}
                                        <button onClick={() => onJoinChat(session)} className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-600">
                                            Join Now
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-8">You have no upcoming sessions.</p>
                            )}
                        </div>
                    </div>
                </div>

            {/* Right Column (Summary & Past Sessions) */}
            <div className="space-y-8">
                {/* Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold">Active Bookings</h3>
                        <div className="text-7xl font-extrabold text-indigo-600 mt-2">{bookings.length}</div>
                        <p className="text-gray-600">Upcoming Sessions</p>
                    </div>

                {/* Call to Action Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg animate-on-load">
                    <div className="flex items-center mb-3">
                         <PlusCircle className="w-8 h-8 text-indigo-500 mr-3"/>
                         <h3 className="text-xl font-bold text-gray-800">Need Help?</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Book a new live chat session with an available professor.</p>
                    <Link to="/browse" className="w-full block text-center bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                                Book a New Session
                            </Link>
                </div>

                {/* Past Sessions Accordion */}
                <div className="bg-white rounded-2xl shadow-lg animate-on-load">
                    <button 
                        onClick={() => setShowPast(!showPast)} 
                        className="w-full flex justify-between items-center p-6 text-left"
                    >
                        <div className="flex items-center">
                            <History className="w-6 h-6 text-gray-500 mr-3"/>
                            <h3 className="text-xl font-bold text-gray-800">Past Sessions</h3>
                        </div>
                        <svg className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${showPast ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showPast ? 'max-h-96' : 'max-h-0'}`}>
                        <div className="px-6 pb-6 space-y-3 border-t border-gray-200 pt-4">
                            {pastSessionsData.map(session => (
                                <div key={session.id} className="p-3 bg-slate-50 rounded-lg opacity-80">
                                    <p className="font-semibold text-sm text-gray-700">{session.topic}</p>
                                    <p className="text-xs text-gray-500">with {session.professor} on {new Date(session.date).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Booking;