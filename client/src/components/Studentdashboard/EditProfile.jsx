import React, { useState, useEffect, useRef } from 'react';
// Using Solid icons for a bolder look on the light theme
import { UserIcon as UserIconSolid, CameraIcon, ArrowUpOnSquareIcon,XCircleIcon } from '@heroicons/react/24/solid';
// Import CreditCard for the new Student ID field
import { Mail, Lock, Building, GraduationCap, Tags, CreditCard } from 'lucide-react';
import { gsap } from 'gsap';
import axiosInstance from '../../api/axios';
import LoadingAnimation from '../ui/LoadingAnimation';
import { useToast } from '../../contexts/ToastContext';

const EditProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // For password reset message
    const [newTag, setNewTag] = useState('');
        const { addToast } = useToast();
    const cardRef = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const { token } = JSON.parse(localStorage.getItem('studentInfo'));
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axiosInstance.get(`/api/students/me/details`, config);
                setProfileData(data);
            } catch (err) {
                setError('Failed to fetch profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [API_URL]);

    useEffect(() => {
        const cardEl = cardRef.current;
        if (!cardEl) return;
        const handleMouseMove = (e) => {
            const rect = cardEl.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = - (y - rect.height / 2) / (rect.height / 2) * 8;
            const rotateY = (x - rect.width / 2) / (rect.width / 2) * 8;
            gsap.to(cardEl, { rotationY: rotateY, rotationX: rotateX, transformPerspective: 1000, ease: 'power1.out' });
        };
        const handleMouseLeave = () => {
            gsap.to(cardEl, { rotationY: 0, rotationX: 0, ease: 'elastic.out(1, 0.5)', duration: 1.2 });
        };
        cardEl.addEventListener('mousemove', handleMouseMove);
        cardEl.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            cardEl.removeEventListener('mousemove', handleMouseMove);
            cardEl.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

        const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

     const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // --- THE FIX: Client-side size validation ---
        const MAX_FILE_SIZE_KB = 400; // Set a max size of 400KB
        if (file.size > MAX_FILE_SIZE_KB * 1024) {
            // alert(`File is too large! Please select an image smaller than ${MAX_FILE_SIZE_KB} KB.`);
            addToast(`File is too large! Please select an image smaller than ${MAX_FILE_SIZE_KB} KB.`, 'error');
            // Clear the file input in case the user tries to submit again
            e.target.value = null; 
            return;
        }
        // --- End of fix ---

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };




    const handleAddTag = () => {
        const trimmedTag = newTag.trim();
        if (trimmedTag && !(profileData.interestTags || []).includes(trimmedTag)) {
            setProfileData(prev => ({ ...prev, interestTags: [...(prev.interestTags || []), trimmedTag] }));
            setNewTag('');
        }
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setProfileData(prev => ({ ...prev, interestTags: (prev.interestTags || []).filter(tag => tag !== tagToRemove) }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token } = JSON.parse(localStorage.getItem('studentInfo'));
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axiosInstance.put(`/api/students/me/details`, profileData, config);
            setProfileData(data);
            // alert('Profile updated successfully!');
            addToast('Profile updated successfully!','error');
        } catch (err) {
            // alert('Error: Could not update profile.');
            addToast('Error: Could not update profile.','error');
        }
    };

    const handleForgotPasswordSubmit = async () => {
        setMessage('');
        setError('');
        try {
            const { data } = await axiosInstance.post(`/api/auth/forgot-password`, { email: profileData.email });
            setMessage(data.message);
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    if (loading) return <LoadingAnimation />;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        // Main background is a soft, light gray
        <div className="bg-slate-100 text-slate-800 min-h-full">
            <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">

                <div className="text-left mb-12">
                    <h1 className="text-4xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-slate-500 mt-1">Update your information and see it live on your student ID.</p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 items-start">

                    <div className="lg:col-span-3 bg-white border p-8 rounded-2xl shadow-lg">
                        <form onSubmit={handleProfileSubmit} className="space-y-8">
                            {/* --- Basic Information --- */}
                            <section>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Basic Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label>Full Name</label>
                                        <div className="relative">
                                            <UserIconSolid className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="text" value={profileData.fullName || ''} readOnly className="w-full pl-11 py-2.5 bg-slate-200 text-slate-500 border rounded-lg cursor-not-allowed" />
                                        </div>
                                    </div>
                                    <div>
                                        <label>Email Address</label>
                                        <div className="relative">
                                            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="email" value={profileData.email || ''} readOnly className="w-full pl-11 py-2.5 bg-slate-200 text-slate-500 border rounded-lg cursor-not-allowed" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* --- Academic Information --- */}
                            <section>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Academic Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label>Level of Study</label>
                                        <div className="relative">
                                            <GraduationCap className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <select name="levelOfStudy" value={profileData.levelOfStudy || 'Undergraduate'} onChange={handleInputChange} className="w-full pl-11 py-2.5 bg-slate-50 border rounded-lg appearance-none">
                                                <option>High School</option><option>Undergraduate</option><option>Postgraduate</option><option>Doctorate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label>University / Institution</label>
                                        <div className="relative">
                                            <Building className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input name="university" type="text" value={profileData.university || ''} onChange={handleInputChange} className="w-full pl-11 py-2.5 bg-slate-50 border rounded-lg" />
                                        </div>
                                    </div>
                                    <div>
                                        <label>Field of Study / Major</label>
                                        <input name="program" type="text" value={profileData.program || ''} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border rounded-lg" />
                                    </div>
                                </div>
                            </section>
                            {/* --- Interests & Needs with Tag Input --- */}
                            <section>
                                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Interests & Needs</h3>
                                <div>
                                    <label>Subjects of Interest</label>
                                    <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border rounded-lg mb-2 min-h-[44px]">
                                        {(profileData.interestTags || []).map(tag => (
                                            <span key={tag} className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">{tag}<button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-indigo-400"><XCircleIcon className="w-4 h-4" /></button></span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={handleTagInputKeyDown} placeholder="Add a new subject..." className="w-full px-4 py-2 border rounded-lg" />
                                        <button type="button" onClick={handleAddTag} className="bg-slate-200 text-slate-600 font-semibold px-4 rounded-lg hover:bg-slate-300">+</button>
                                    </div>
                                </div>
                            </section>
                            <div className="pt-4">
                                <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">
                                    <ArrowUpOnSquareIcon className="w-5 h-5 mr-2" /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        {/* Student ID Card */}
                        <div ref={cardRef} className="w-full max-w-sm h-64 bg-gradient-to-br from-slate-900 to-slate-800 border rounded-2xl shadow-2xl p-6 flex flex-col justify-between text-white">
                            <h3 className="font-bold text-lg">Student ID</h3>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <img src={profileData.profileImage} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2" />
                                    <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full cursor-pointer">
                                        <CameraIcon className="w-5 h-5 text-gray-600" />
                                        <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                                <div>
                                    <p className="font-bold text-xl">{profileData.fullName}</p>
                                    <p className="text-sm text-slate-300">{profileData.student?._id || 'ID not available'}</p>
                                    <p className="text-xs text-slate-400 mt-2">{profileData.program}</p>
                                    <p className="text-xs text-slate-400">{profileData.university}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold flex items-center"><Lock className="w-5 h-5 mr-3 text-amber-500" /> Security</h3>
                            <p className="text-sm text-amber-700 my-2">Manage your account security settings.</p>
                            {message && <p className="text-sm text-green-700 my-2">{message}</p>}
                            <button onClick={handleForgotPasswordSubmit} className="w-full text-center bg-white border font-bold py-2.5 rounded-lg hover:bg-amber-100">
                                Change Password
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditProfile;