import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { Star, CheckCircle, Clock, Info, Award } from 'lucide-react';
import Navbar from '../components/homepage/Navbar';
import Footer from '../components/homepage/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BookingModal from '../components/booking/BookingModal';
import LoadingAnimation from '../components/ui/LoadingAnimation';
import ReviewList from '../components/reviews/ReviewList'; // <-- Import
import ReviewForm from '../components/reviews/ReviewForm';
import { useToast } from '../contexts/ToastContext';

gsap.registerPlugin(ScrollTrigger);

const ProfessorDetailPage = () => {
    const { id } = useParams(); // Get the faculty ID from the URL
    const [professor, setProfessor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [services, setServices] = useState([]);
    const [activeTab, setActiveTab] = useState('about');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
      const [reviews, setReviews] = useState([]); // <-- State for reviews
    const [studentBookings, setStudentBookings] = useState([]); 
      const { addToast } = useToast(); 
    const pageRef = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL;

    // --- FETCH DATA FROM BACKEND ---
    useEffect(() => {

        const userInfo = JSON.parse(localStorage.getItem('studentInfo')) || JSON.parse(localStorage.getItem('facultyInfo'));
        setCurrentUser(userInfo);
        const fetchProfessorData = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch professor details and their services in parallel
                const professorPromise = axiosInstance.get(`/api/faculty/profiles/${id}`);
                const servicesPromise = axiosInstance.get(`/api/services/faculty/${id}`);
                const reviewsPromise = axiosInstance.get(`/api/reviews/faculty/${id}`);
                

                 let studentBookingsPromise = Promise.resolve({ data: [] });
                // If a student is logged in, fetch their specific bookings with this faculty
                if (userInfo?.role === 'student') {
                    studentBookingsPromise = axiosInstance.get('/api/bookings/my-bookings');
                }

                const [professorRes, servicesRes, reviewsRes, studentBookingsRes] = await Promise.all([professorPromise, servicesPromise, reviewsPromise, studentBookingsPromise]);

                setProfessor(professorRes.data);
                setServices(servicesRes.data);
                setReviews(reviewsRes.data);
                setStudentBookings(studentBookingsRes.data.filter(b => b.faculty._id === id));
            } catch (err) {
                setError('Could not load professor profile. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfessorData();
    }, [id, API_URL]);

    // GSAP Animations (unchanged)
    useLayoutEffect(() => {
        if (!loading && professor) {
            const ctx = gsap.context(() => {
                gsap.fromTo(".hero-animate", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' });
                gsap.fromTo(".content-animate", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ".main-content", start: "top 80%" } });
            }, pageRef);
            return () => ctx.revert();
        }
    }, [loading, professor]);

     const handleSubmitReview = async ({ bookingId, rating, comment }) => {
        try {
            await axiosInstance.post('/api/reviews', { bookingId, rating, comment });
            // alert("Review submitted successfully!");
            addToast("Review submitted successfully!", "success");
            // Refetch reviews to show the new one
            const { data } = await axiosInstance.get(`/api/reviews/faculty/${id}`);
            setReviews(data);
        } catch (error) {
            addToast(error.response?.data?.message || "Failed to submit review.", "error");
        }
    };

    const renderContent = () => {
        const currencySymbols = { USD: '$', INR: '₹' };

        const isUserFaculty = currentUser?.role === 'faculty' || currentUser?.role === 'admin';

        switch (activeTab) {
            case 'services':
                if (services.length === 0) {
                    return <p className="text-lg text-text-secondary leading-relaxed">This mentor has not listed any services yet.</p>;
                }
                return (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 text-indigo-800 p-4 rounded-lg text-center">
                            <p className="font-semibold">Promotional Offer!</p>
                            <p className="text-sm mt-1">All chat services are free for a limited time. Sessions will be paid in the future.</p>
                        </div>
                        {services.map(service => (
                            <div key={service._id} className="p-6 bg-white rounded-lg border border-border-color flex flex-col md:flex-row justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-primary">{service.title}</h3>
                                    <p className="text-text-secondary mt-1">{service.description}</p>
                                </div>
                                <div className="text-right mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                                    <div className="flex items-baseline justify-end gap-3">
                                        <p className="text-xl font-bold text-gray-400 line-through">
                                            {currencySymbols[service.currency]}{service.price.toFixed(2)}
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            FREE
                                        </p>
                                    </div>
                                    {/* Duration can be added to the Service model later if needed */}
                                    <p className="text-sm text-text-secondary">Session</p>
                                </div>
                            </div>
                        ))}
    
                    </div>
                );
             case 'reviews':
                // Check if the current student has completed a booking with this faculty and hasn't reviewed it yet
                const reviewedBookingIds = reviews.map(r => r.booking);
                const eligibleBooking = studentBookings.find(b => !reviewedBookingIds.includes(b._id));
                
                return (
                    <div>
                        {eligibleBooking && <ReviewForm bookingId={eligibleBooking._id} onSubmitReview={handleSubmitReview} />}
                        <div className={eligibleBooking ? "mt-8" : ""}>
                            <ReviewList reviews={reviews} />
                        </div>
                    </div>
                );
            case 'about':
            default:
                return <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">{professor.bio || 'No biography provided.'}</p>;
        }
    };

    if (loading) return <LoadingAnimation />;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!professor) return <div className="min-h-screen flex items-center justify-center">Profile not found.</div>;

    const specialty = `Expert in ${(professor.expertiseTags || []).slice(0, 2).join(' & ')}`;
    const isUserFaculty = currentUser?.role === 'faculty' || currentUser?.role === 'admin';

    return (
        <div ref={pageRef} className="bg-gray-50">
            <Navbar />

            {/* --- Hero Section --- */}
            <header className="bg-white pt-32 pb-16">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
                    <img src={professor.profileImage || '/default-avatar.png'} alt={professor.faculty.fullName} className="hero-animate w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-2xl mb-6 md:mb-0 md:mr-8" />
                    <div className="text-center md:text-left">
                        <h1 className="hero-animate text-4xl lg:text-5xl font-serif font-extrabold text-primary">{professor.faculty.fullName}</h1>
                        <p className="hero-animate mt-2 text-xl text-text-secondary">{`${professor.title || 'Specialist'}, ${professor.education || 'University'}`}</p>
                        <p className="hero-animate mt-1 text-lg font-semibold text-accent">{specialty}</p>
                        <div className="hero-animate mt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-6 gap-y-2 text-text-secondary">
                            {professor.stats.reviewsCount > 0 && (
                                <div className="flex items-center">
                                    <Star size={16} className="text-amber-500 mr-1.5 fill-current" /> 
                                    <span className="font-bold text-text-primary mr-1">
                                        {professor.stats.averageRating.toFixed(1)}
                                    </span> 
                                    ({professor.stats.reviewsCount} Reviews)
                                </div>
                            )}
                            {professor.stats.sessionsCompleted > 0 && (
                                <div className="flex items-center">
                                    <Award size={16} className="text-primary mr-1.5" /> 
                                    {professor.stats.sessionsCompleted}+ Sessions Completed
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* --- Left Column: Main Content --- */}
                    <div className="lg:col-span-2 main-content content-animate">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color/30">
                            {/* Tabs */}
                            <div className="border-b border-border-color mb-6 flex space-x-6">
                                <button onClick={() => setActiveTab('about')} className={`py-3 font-semibold ${activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>About</button>
                                <button onClick={() => setActiveTab('services')} className={`py-3 font-semibold ${activeTab === 'services' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Services</button>
                                <button onClick={() => setActiveTab('reviews')} className={`py-3 font-semibold ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}>Reviews</button>
                            </div>
                            {/* Content */}
                            <div className="min-h-[300px]">{renderContent()}</div>
                        </div>
                    </div>


                    {/* --- Right Column: Sticky Sidebar --- */}
                    <div className="lg:sticky top-28 content-animate">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-border-color/30">
                            <h3 className="text-xl font-serif font-bold text-primary mb-4">Quick Info</h3>
                            <ul className="space-y-3 text-text-secondary">
 <li className="flex items-center">
                                    <CheckCircle size={18} className={`${professor.isAvailable ? 'text-green-500' : 'text-gray-400'} mr-3`} /> 
                                    <strong>Status:</strong>
                                    <span className={`ml-auto font-bold px-3 py-1 text-xs rounded-full ${professor.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {professor.isAvailable ? 'Available' : 'Offline'}
                                    </span>
                                </li>
                                <li className="flex items-center"><Clock size={18} className="text-primary mr-3" /> <strong>Response Time:</strong><span className="ml-auto font-semibold text-text-primary">Within 24 hours</span></li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-border-color">
                                <h3 className="text-xl font-serif font-bold text-primary mb-4">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(professor.expertiseTags || []).map(tag => <span key={tag} className="bg-gray-100 text-text-secondary text-sm font-semibold px-3 py-1 rounded-full">{tag}</span>)}
                                </div>
                            </div>
                            {isUserFaculty ? (
                                <div className="mt-6 bg-blue-50 text-blue-700 p-3 rounded-lg flex items-start text-sm">
                                    <Info size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <span>Please log in as a student to book a session.</span>
                                </div>
                            ) : (
                                <button onClick={() => setIsBookingModalOpen(true)} className="w-full block text-center mt-6 py-3 font-bold text-white bg-accent rounded-lg hover:bg-opacity-90 shadow-md">
                                    Request a Session
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                professor={professor} // Pass the entire professor object now
                services={services}
            />
        </div>
    );
};

export default ProfessorDetailPage;