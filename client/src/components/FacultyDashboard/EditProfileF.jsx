import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, CameraIcon, BriefcaseIcon, AcademicCapIcon, ArrowUpOnSquareIcon, XCircleIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import { gsap } from 'gsap';
import LoadingAnimation from '../ui/LoadingAnimation';
import { useToast } from '../../contexts/ToastContext'; 

const EditProfileF = ({ profileData, setProfileData,onSubmit }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [newTag, setNewTag] = useState('');
  const cardRef = useRef(null);
      const { addToast } = useToast();
  

  // useEffect for 3D card animation
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
        // Handle nested financials object
        if (name.includes('.')) {
            const [parentKey, childKey] = name.split('.');
            setProfileData(prev => ({
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [childKey]: value
                }
            }));
        } else {
            // Handle top-level properties
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
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
        if (trimmedTag && !(profileData.expertiseTags || []).includes(trimmedTag)) {
            setProfileData(prev => ({ ...prev, expertiseTags: [...(prev.expertiseTags || []), trimmedTag] }));
            setNewTag(''); // Clear the input field
        }
    };

    // --- NEW: Handler for "Enter" key press in the tag input ---
    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the main form from submitting
            handleAddTag();     // Add the tag
        }
    };


    const handleRemoveTag = (tagToRemove) => {
        setProfileData(prev => ({ ...prev, expertiseTags: (prev.expertiseTags || []).filter(tag => tag !== tagToRemove) }));
    };

      const handleAvailabilityChange = (e) => {
        setProfileData(prev => ({ ...prev, isAvailable: e.target.checked }));
    };


    if (!profileData) return <LoadingAnimation/>;

  return (
    <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-lg">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6">
                        <button type="button" onClick={() => setActiveTab('profile')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Profile Details</button>
                        <button type="button" onClick={() => setActiveTab('financial')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'financial' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Financial</button>
                    </nav>
                </div>

                <form onSubmit={onSubmit}>
                    {/* Profile Details Tab */}
                    <div className={`space-y-6 ${activeTab !== 'profile' && 'hidden'}`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                                <div className="relative"><UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input name="fullName" type="text" value={profileData.fullName || ''} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 border rounded-lg"/></div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Current Position/Title</label>
                                <div className="relative"><BriefcaseIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input name="title" type="text" value={profileData.title || ''} onChange={handleInputChange} required className="w-full pl-12 pr-4 py-3 border rounded-lg"/></div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Highest Education</label>
                            <div className="relative"><AcademicCapIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input name="education" type="text" value={profileData.education || ''} onChange={handleInputChange} required className="w-full pl-12 pr-4 py-3 border rounded-lg"/></div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Profile Bio/Introduction</label>
                            <textarea name="bio" value={profileData.bio || ''} onChange={handleInputChange} rows="4" required className="w-full px-4 py-3 border rounded-lg" placeholder="A compelling summary..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Areas of Expertise</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(profileData.expertiseTags || []).map(tag => (
                                    <span key={tag} className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">{tag}<button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-indigo-400 hover:text-indigo-600"><XCircleIcon className="w-4 h-4"/></button></span>
                                ))}
                            </div>
                           <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={newTag} 
                                    onChange={(e) => setNewTag(e.target.value)} 
                                    onKeyDown={handleTagInputKeyDown} // <-- ADDED: Handles "Enter" key
                                    placeholder="Add a new skill..." 
                                     className="w-full px-4 py-2 border rounded-lg"
                                />
                                <button 
                                    type="button" // <-- CHANGED: From "submit" to "button"
                                    onClick={handleAddTag} // <-- CHANGED: From onSubmit to onClick
                                    className="bg-slate-200 text-slate-600 font-semibold px-4 rounded-lg hover:bg-slate-300"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                         <div className="pt-4 border-t">
                            <label htmlFor="availability-toggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        id="availability-toggle" 
                                        className="sr-only" 
                                        checked={profileData.isAvailable || false} 
                                        onChange={handleAvailabilityChange} 
                                    />
                                    <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-base font-semibold text-gray-700">Available Now</p>
                                    <p className="text-sm text-gray-500">Toggle this on to show you are available for immediate sessions.</p>
                                </div>
                            </label>
                        </div>

                    </div>

                    {/* Financial Tab */}
                    <div className={`space-y-6 ${activeTab !== 'financial' && 'hidden'}`}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2" htmlFor="payoutMethod">Payout Method</label>
                            <select id="payoutMethod" name="financials.payoutMethod" value={profileData.financials?.payoutMethod || 'paypal'} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg bg-white">
                                <option value="paypal">PayPal</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                        </div>
                        {profileData.financials?.payoutMethod === 'paypal' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">PayPal Email</label>
                                <div className="relative"><AtSymbolIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input name="financials.paypalEmail" type="email" value={profileData.financials?.paypalEmail || ''} onChange={handleInputChange}  className="w-full pl-12 pr-4 py-3 border rounded-lg" placeholder="your.email@paypal.com"/></div>
                            </div>
                        )}
                        {profileData.financials?.payoutMethod === 'bank' && (
                            <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                                <h4 className="font-semibold text-gray-700">Bank Account Details</h4>
                                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Account Holder Name</label><input name="financials.bankAccountName" type="text" value={profileData.financials?.bankAccountName || ''} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md"/></div>
                                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Account Number</label><input name="financials.bankAccountNumber" type="text" value={profileData.financials?.bankAccountNumber || ''} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md"/></div>
                                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Bank Name / Routing Number</label><input name="financials.bankRoutingNumber" type="text" value={profileData.financials?.bankRoutingNumber || ''} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md"/></div>
                                <div><label className="block text-xs font-semibold text-gray-500 mb-1">Bank IFSC Code</label><input name="financials.bankIfscCode" type="text" value={profileData.financials?.bankIfscCode || ''} onChange={handleInputChange} required  className="w-full px-4 py-2 border rounded-md"/></div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 mt-6 border-t">
                        <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">
                            <ArrowUpOnSquareIcon className="w-5 h-5 mr-2" />
                            Save All Changes
                        </button>
                    </div>
                </form>
            </div>


        {/* --- Right Column: Live Consultant Card Preview --- */}
        <div ref={cardRef} className="lg:col-span-2 flex items-center justify-center h-full">
            <div className="w-full max-w-sm bg-slate-800 rounded-2xl shadow-2xl p-8 text-center" style={{ transformStyle: 'preserve-3d' }}>
                <div className="relative inline-block">
                     <img src={profileData.profileImage} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-indigo-400 shadow-lg" />
                     <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-200 transition-colors">
                        <CameraIcon className="w-5 h-5 text-gray-600" />
                        <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                     </label>
                </div>
                <h3 className="text-2xl font-bold text-white mt-4">{profileData.fullName}</h3>
                <p className="font-semibold text-indigo-300">{profileData.title}</p>
                <p className="text-sm text-slate-400 mt-4 text-center max-w-xs mx-auto">{profileData.bio}</p>
                <div className="border-t border-slate-700 mt-6 pt-6">
                     <h4 className="font-semibold text-white text-center mb-4">Areas of Expertise</h4>
                     <div className="flex flex-wrap justify-center gap-2">
                         {profileData.expertiseTags && profileData.expertiseTags.map(tag => (
                             <span key={tag} className="bg-indigo-500/20 text-indigo-200 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                         ))}
                     </div>
                </div>
            </div>
        </div>
          <style jsx>{`
                input:checked ~ .dot { transform: translateX(100%); background-color: #4F46E5; }
                input:checked + .block { background-color: #a5b4fc; }
            `}</style>
    </div>
  );
};

export default EditProfileF;