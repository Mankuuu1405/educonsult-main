// src/pages/BrowsePage.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Filter, X, Award } from 'lucide-react';
import Navbar from '../components/homepage/Navbar';
import Footer from '../components/homepage/Footer';
import { gsap } from 'gsap';
import axiosInstance from '../api/axios';
import LoadingAnimation from '../components/ui/LoadingAnimation';


const serviceTypes = ['Live Chat', 'Thesis Review', 'Project Guidance', 'Mock Interview', 'Career Advice'];

const ProfessorCard = ({ prof }) => {
    // The 'prof' object is now a document from the FacultyDetail collection
    const { faculty, title, education, profileImage, expertiseTags, isAvailable } = prof;

    // Default values to prevent errors if data is missing
    const facultyName = faculty?.fullName || 'N/A';
    const facultyId = faculty?._id || '#';

    return (
        <div className="bg-white rounded-2xl shadow-card border border-border-color/60 p-5 flex flex-col transform hover:-translate-y-2 transition-transform duration-300 overflow-hidden group">
            <div className="flex items-start mb-4">
                <img src={profileImage || '/default-avatar.png'} alt={facultyName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mr-4 border-2 border-white shadow-md" />
                <div className="flex-grow">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-primary">{facultyName}</h3>
                    <p className="text-text-secondary font-sans text-sm">{education || 'Education not specified'}</p>
                    {/* Rating and reviews can be added later */}
                </div>
            </div>
            <p className="text-text-primary font-sans mb-4 text-sm leading-relaxed flex-grow">
                <span className="font-semibold text-text-secondary">Specialty:</span> {title || 'Not specified'}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
                {(expertiseTags || []).map(tag => (
                    <span key={tag} className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
                ))}
            </div>
            <div className="mt-auto pt-4 border-t border-border-color flex justify-between items-center">
               <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 transition-colors ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className={`text-sm font-semibold ${isAvailable ? 'text-green-600' : 'text-text-secondary'}`}>
                        {isAvailable ? 'Available Now' : 'Offline'}
                    </span>
                </div>
                <Link to={`/professor/${facultyId}`} className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-bold text-white bg-primary rounded-lg hover:bg-secondary transition-all duration-300 shadow-md transform group-hover:scale-105">
                    View Profile
                </Link>
            </div>
        </div>
    );
};

const BrowsePage = () => {
    const [professorsData, setProfessorsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- Filter and Search state (unchanged) ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeServices, setActiveServices] = useState([]);
    const [availableNow, setAvailableNow] = useState(false);

    const cardGridRef = useRef(null);

    // --- FETCH DATA FROM BACKEND ---
    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true); // Set loading to true at the start of fetch
            try {
                const { data } = await axiosInstance.get(`/api/faculty/profiles`);
                setProfessorsData(data);
            } catch (err) {
                setError('Could not fetch profiles. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false when fetch is complete (success or error)
            }
        };
        fetchProfiles();
    }, []);

    const handleServiceToggle = (service) => {
        setActiveServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
    };

    // --- MODIFIED useMemo to work with new data structure ---
    const filteredProfessors = useMemo(() => {
        return professorsData.filter(prof => {
            const facultyName = prof.faculty?.fullName || '';
            const title = prof.title || '';
            const tags = prof.expertiseTags || [];

            const searchMatch = facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            // NOTE: The service filter logic assumes you will add a 'services' array to your FacultyDetail model later.
            // For now, we are filtering by expertiseTags.
            const serviceMatch = activeServices.length === 0 ||
                activeServices.every(service => tags.includes(service));

            const availabilityMatch = !availableNow || prof.isAvailable === true;

            return searchMatch && serviceMatch && availabilityMatch;
        });
    }, [searchTerm, activeServices, availableNow, professorsData]);

    useEffect(() => {
        // Only run GSAP animation if not loading
        if (!loading && cardGridRef.current) {
            gsap.fromTo(cardGridRef.current.children,
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
            );
        }
    }, [filteredProfessors, loading]); // Add loading to dependency array

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16">
                <header className="text-center mb-12 sm:mb-16">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-primary leading-tight">
                        Our Directory of Experts
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-3xl mx-auto">
                        Your journey to mastery begins here. Search, filter, and connect with the world's leading minds, ready to guide you.
                    </p>
                </header>

                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-10 sm:mb-12 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
                        <div className="lg:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input type="text" placeholder="Search by name, title, or skill..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        {/* We can remove the category dropdown for now as we search tags directly */}
                        <div className="lg:col-start-4 flex items-center justify-center bg-gray-50 rounded-lg p-3 border">
                            <label htmlFor="availability" className="flex items-center cursor-pointer">
                                <div className="relative"><input type="checkbox" id="availability" className="sr-only" checked={availableNow} onChange={(e) => setAvailableNow(e.target.checked)} /><div className="block bg-gray-300 w-14 h-8 rounded-full"></div><div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div></div>
                                <div className="ml-3 text-text-primary font-semibold">Available Now</div>
                            </label>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {serviceTypes.map(service => (
                                <button key={service} onClick={() => handleServiceToggle(service)}
                                    className={`px-3 py-1.5 text-sm font-bold rounded-full transition-all border-2 ${activeServices.includes(service) ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-500 hover:border-primary/50 hover:text-primary'}`}>
                                    {service}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoadingAnimation />
                    </div>
                ) : (
                    <>
                        {error && <p className="text-center text-red-500 text-lg mb-8">{error}</p>}
                        <div ref={cardGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredProfessors.map(prof => <ProfessorCard key={prof._id} prof={prof} />)}
                        </div>

                        {filteredProfessors.length === 0 && !error && ( // Only show "No Experts Found" if no error and no professors
                            <div className="text-center py-16 sm:py-20 col-span-full">
                                <div className="inline-block p-5 bg-accent/10 rounded-full mb-6">
                                    <Search className="h-10 w-10 sm:h-12 sm:h-12 text-accent" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">No Experts Found</h3>
                                <p className="mt-2 text-text-secondary">
                                    Try adjusting your search or filter criteria. The perfect mentor is waiting for you!
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
            <style jsx>{`
                input:checked ~ .dot { transform: translateX(100%); background-color: #4F46E5; /* A sample accent color */ }
                input:checked + .block { background-color: #312E81; /* A sample primary color */ }
            `}</style>
        </div>
    );
};

export default BrowsePage;