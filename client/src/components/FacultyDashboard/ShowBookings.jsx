import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video } from 'lucide-react';
import axiosInstance from '../../api/axios';
import LoadingAnimation from '../ui/LoadingAnimation';

const ShowBookings = ({onJoinChat}) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axiosInstance.get(`/api/bookings/my-faculty-bookings`, config);
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings.');
      } finally {
        setIsLoading(false);
      }
    };
    loadBookings();
  }, [API_URL]);

  if (isLoading) {
    return <LoadingAnimation/>;
  }

  if (error) {
    return <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow-md">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Upcoming Bookings</h2>
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-slate-50 p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="font-bold text-indigo-700 text-lg">{booking.service?.title}</p>
                <p className="text-slate-600">With: {booking.student?.fullName}</p>
                <div className="flex items-center text-sm text-slate-500 mt-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 mr-2 ml-4" />
                  <span>{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {booking.status}
                </span>
                <button
                  onClick={() => onJoinChat(booking)}
                   disabled={!booking.student} 
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-8">You have no upcoming bookings.</p>
      )}
    </div>
  );
};

export default ShowBookings;


