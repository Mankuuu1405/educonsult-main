import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { Users, ArrowLeft, UserCheck } from 'lucide-react';
import { gsap } from 'gsap';
import LoadingAnimation from '../ui/LoadingAnimation';
// --- Reusable Faculty Profile Card Component (Now uses real data structure) ---
const FacultyCard = ({ faculty, onSelect }) => {
    const cardRef = useRef(null);
    
    // The main faculty object now comes from the 'faculty' populated field
       const { fullName, email } = faculty.faculty; 
    // We get profileImage and expertiseTags from the top-level 'faculty' object itself.
    const { profileImage, expertiseTags } = faculty;

    return (
        <div ref={cardRef} className="bg-slate-800 text-white rounded-2xl shadow-lg overflow-hidden relative transform transition-transform hover:-translate-y-2">
            <div className={`h-20 bg-gradient-to-r from-indigo-500 to-blue-500`}></div>
            <div className="p-6 pt-0">
                <img 
                    src={profileImage || '/default-avatar.png'} 
                    alt={fullName}
                    className="w-28 h-28 rounded-full -mt-14 mx-auto border-4 border-slate-800 shadow-md object-cover"
                />
                <div className="text-center mt-4">
                    <h3 className="font-bold text-xl text-white">{fullName}</h3>
                    <p className="text-sm text-slate-400">{email}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2 min-h-[28px]">
                        {(expertiseTags || []).slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-slate-700 text-slate-300 font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <button 
                        onClick={() => onSelect(faculty)}
                        className="mt-6 w-full bg-indigo-600 font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main FacultyManagement Component ---
const FacultyManagement = () => {
    const [facultyList, setFacultyList] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [facultyDetails, setFacultyDetails] = useState({ services: [] });
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL;

    // Fetch the main list of all faculty members
    useEffect(() => {
        const fetchFacultyList = async () => {
            setLoading(true);
            try {
                const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axiosInstance.get(`/api/admin/faculty-list`, config);
                setFacultyList(data);
            } catch (error) {
                console.error("Failed to fetch faculty list", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFacultyList();
    }, [API_URL]);

    // Fetch details for a selected faculty member
    useEffect(() => {
        if (selectedFaculty) {
            const fetchDetails = async () => {
                try {
                    const { token } = JSON.parse(localStorage.getItem('facultyInfo'));
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    // We use the faculty's main ID, not the profile's ID
                    const { data } = await axiosInstance.get(`/api/admin/faculty/${selectedFaculty.faculty._id}/details`, config);
                    setFacultyDetails(data);
                } catch (error) {
                    console.error("Failed to fetch faculty details", error);
                }
            };
            fetchDetails();
        }
    }, [selectedFaculty, API_URL]);
    
    if (loading) return <LoadingAnimation />;

    // View 1: Main list of all faculty members
    if (!selectedFaculty) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800">Faculty Management</h1>
                        <p className="text-slate-500 mt-1 text-lg">An overview of all registered faculty members.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
                        <div className="p-3 bg-indigo-500 rounded-lg"><Users className="h-6 w-6 text-white" /></div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Faculty</p>
                            <p className="text-3xl font-bold text-slate-800">{facultyList.length}</p>
                        </div>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {facultyList.map(faculty => (
                        <FacultyCard key={faculty._id} faculty={faculty} onSelect={setSelectedFaculty} />
                    ))}
                </div>
            </div>
        );
    }

    // View 2: Detailed view for a single selected faculty member
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <button onClick={() => setSelectedFaculty(null)} className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Faculty
                </button>
                <h1 className="text-3xl font-bold text-slate-800">Faculty Details</h1>
                <p className="text-slate-500 mt-1">Services and booking data for <span className="font-semibold text-slate-700">{selectedFaculty.faculty.fullName}</span>.</p>
            </header>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">Provided Services ({facultyDetails.services.length})</h2>
                {facultyDetails.services.length > 0 ? (
                    <div className="space-y-4">
                        {facultyDetails.services.map(service => (
                            <div key={service._id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-700">{service.title}</p>
                                </div>
                                <div className="flex items-center bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    {service.bookingsCount} Bookings
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-500 py-8">This faculty member has not provided any services yet.</p>
                )}
            </div>
        </div>
    );
};

export default FacultyManagement;