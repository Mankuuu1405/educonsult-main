import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  StarIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../../api/axios';
import EditProfileF from '../FacultyDashboard/EditProfileF';
import { useNavigate } from 'react-router-dom';

const FacultyManagement = () => {
  const navigate=useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data } = await axiosInstance.get(`/api/admin/faculty-list`);
        console.log(data);
        setFaculty(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching faculty:', error);
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const filteredFaculty = faculty.filter(f => {
  // First, check if f and f.faculty exist to prevent crashes
  if (!f || !f.faculty) {
    return false;
  }
  
  // If they exist, perform the search
  const fullNameMatch = f.faculty.fullName.toLowerCase().includes(searchTerm.toLowerCase());
  const emailMatch = f.faculty.email.toLowerCase().includes(searchTerm.toLowerCase());

  return fullNameMatch || emailMatch;
});


  const handleViewFaculty = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    handleModel(facultyMember);
    setShowModal(true);
  };

  const handleModel=async (facultyMember)=>{
    try {
      // The API call now returns faculty details PLUS the totalBookings count
      const { data } = await axiosInstance.get(`/api/admin/faculty/${facultyMember['_id']}/details`);
      
      console.log(data);
      
      
     setSelectedFaculty(data);

    } catch (e) {
      console.error("Failed to fetch faculty details:", e);
      // Optionally, you can add error handling here, like showing a notification.
    }
  }

  //Delete Funcitonality for Faculty
  const handleDeleteFaculty = async (facultyId) => {
        // Step 1: Confirm with the user before deleting
        console.log(facultyId);
        if (!window.confirm('Are you sure you want to delete this faculty member? This action cannot be undone.')) {
            return; // If user clicks 'Cancel', do nothing
        }

        try {
            // Step 2: Call the backend API to delete the faculty member
            await axiosInstance.delete(`/api/admin/faculty/${facultyId}`);

            // Step 3: Update the local state to reflect the deletion
            // This filters out the deleted member and triggers a re-render
            setFaculty(currentFaculty => currentFaculty.filter(f => f._id !== facultyId));
            
            // Optional: Add a success notification (e.g., toast message)
            // alert('Faculty deleted successfully');

        } catch (error) {
            console.error('Error deleting faculty:', error);
            // Optional: Add an error notification
            alert('Failed to delete faculty. Please try again.');
        }
    };

    //update funcitonlity
     const handleEditFaculty = (facultyMember) => {
    // We create a structured object for easier form management
    setEditingFaculty({
      _id: facultyMember._id,
      fullName: facultyMember.faculty.fullName,
      email: facultyMember.faculty.email,
      title: facultyMember.title,
      isAvailable: facultyMember.isAvailable,
      // Convert tags array to a comma-separated string for the textarea
      expertiseTags: facultyMember.expertiseTags.join(', ')
    });
    setShowEditModal(true);
  };

  // Updates the state as the admin types in the edit form
  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingFaculty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submits the updated data to the backend
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editingFaculty) return;

    // Convert the tags string back into an array
    const updatedData = {
      ...editingFaculty,
      expertiseTags: editingFaculty.expertiseTags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    try {
      const { data: updatedFaculty } = await axiosInstance.put(
        `/api/admin/faculty/${editingFaculty._id}`,
        updatedData
      );
      
      // Update the main faculty list with the new data
      setFaculty(prev => 
        prev.map(f => (f._id === updatedFaculty._id ? updatedFaculty : f))
      );
      
      setShowEditModal(false); // Close the modal
      setEditingFaculty(null); // Clear the editing state
    } catch (error) {
      console.error('Error updating faculty:', error);
      alert('Failed to update faculty.');
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "admin-badge";
    
    switch (status) {
      case true:
        return `${baseClasses} admin-badge-success`; // For 'Available' or 'Active'
      case false:
        return `${baseClasses} admin-badge-warning`; // For 'Unavailable' or 'Inactive'
      case 'suspended': // Keep this in case you have another property for suspension
        return `${baseClasses} admin-badge-danger`;
      default:
        return `${baseClasses} admin-badge-info`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="admin-loading"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-admin-900">Faculty Management</h1>
          <p className="text-admin-600">Manage faculty members and their services</p>
        </div>
        {/* <div className="flex items-center space-x-3">
          <button onClick={()=>navigate('/edit-profile-f')} className="admin-button-primary">
            Add New Faculty
          </button>
        </div>   */}
      </div>

      {/* Search and Filter */}
      <div className="admin-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-admin-400" />
            </div>
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          
          {/* <div className="flex items-center space-x-3">
            <button className="admin-button-secondary">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
            <select className="admin-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div> */}
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {filteredFaculty.map((facultyMember) => {
    // Determine the text to display based on the boolean value
    const statusText = facultyMember.isAvailable ? 'Active' : 'Inactive';

    return (
        <div key={facultyMember['_id']} className="admin-card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        {facultyMember.profileImage ? (
                            <img
                                src={facultyMember.profileImage}
                                alt={facultyMember.faculty?facultyMember.faculty.fullName:""}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <UserCircleIcon className="h-8 w-8 text-primary-600" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-admin-900">{facultyMember.faculty?facultyMember.faculty.fullName:""}</h3>
                        <p className="text-sm text-admin-600">{facultyMember.faculty.email}</p>
                    </div>
                </div>
                {/* 
                    1. Pass the boolean 'facultyMember.isAvailable' to the function.
                    2. Display the 'statusText' string we created above.
                */}
                <span className={getStatusBadge(facultyMember.isAvailable)}>
                    {statusText}
                </span>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-sm text-admin-600 mb-1">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                        {facultyMember.expertiseTags.slice(0, 3).map((skill, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-admin-100 text-admin-700 text-xs rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                        {facultyMember.expertiseTags.length > 3 && (
                            <span className="px-2 py-1 bg-admin-100 text-admin-700 text-xs rounded-full">
                                +{facultyMember.expertiseTags.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-admin-600">Rating</p>
                        <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-semibold">4</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-admin-600">title</p>
                        <p className="font-semibold">{facultyMember.title}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-admin-200">
                    <div>
                        <p className="text-sm text-admin-600">Earnings</p>
                        <p className="font-semibold text-green-600">
                            $500
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handleViewFaculty(facultyMember)}
                            className="p-2 text-admin-600 hover:bg-admin-100 rounded-lg"
                            title="View Details"
                        >
                            <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleEditFaculty(facultyMember)}
                            className="p-2 text-admin-600 hover:bg-admin-100 rounded-lg"
                            title="Edit"
                        >
                            <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteFaculty(facultyMember._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
})}
      </div>

      {/* Faculty Detail Modal */}
      {showModal && selectedFaculty && (
    <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-admin-900">
                        Faculty Details
                    </h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-admin-1000 hover:text-admin-600"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                            {selectedFaculty.profileImage ? (
                                <img
                                    src={selectedFaculty.profileImage}
                                    // Use optional chaining for safety
                                    alt={selectedFaculty.faculty?.fullName}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <UserCircleIcon className="h-10 w-10 text-primary-600" />
                            )}
                        </div>
                        <div>
                            {/* 
                                FIX 1: Use 'faculty.fullName' instead of 'name'.
                                Added optional chaining (?.) for safety.
                            */}
                            <h4 className="text-xl font-semibold text-admin-900">
                                {selectedFaculty.faculty?.fullName}
                            </h4>
                            <p className="text-admin-600">{selectedFaculty.faculty?.email}</p>
                            <span className={getStatusBadge(selectedFaculty.isAvailable)}>
                                {selectedFaculty.isAvailable ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-admin-600">Education</p>
                            <div className="flex items-center">
                                {/* <StarIcon className="h-4 w-4 text-yellow-400 mr-1" /> */}
                                    

                                {/* Data was commented out, using mock 'rating' for now */}
                                <span className="font-semibold">{selectedFaculty.education}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-admin-600">Total Bookings</p>
                            {/* Data was commented out, using mock 'totalBookings' for now */}
                            <p className="font-semibold">{selectedFaculty.totalBookings}</p>
                        </div>
                        <div>
                            <p className="text-sm text-admin-600">Total Earnings</p>
                            <p className="font-semibold text-green-600">
                                {/* Using 'earnings' property from your data */}
                                ${selectedFaculty.earnings?.toLocaleString() || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-admin-600">Join Date</p>
                            <p className="font-semibold">
                                {/* 
                                    FIX 2: Use 'joinDate' instead of 'createdAt'.
                                    Added check to prevent invalid date errors.
                                */}
                                {selectedFaculty.createdAt? new Date(selectedFaculty.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-admin-600 mb-2">Expertise</p>
                        <div className="flex flex-wrap gap-2">
                           
                            {selectedFaculty.expertiseTags && selectedFaculty.expertiseTags.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-admin-200">
                    <button
                        onClick={() => setShowModal(false)}
                        className="admin-button-secondary"
                    >
                        Close
                    </button>
                    <button 
                    onClick={()=>{handleEditFaculty(selectedFaculty)}}
                    className="admin-button-primary">
                        Edit Faculty
                    </button>
                </div>
            </div>
        </div>  
    </div>
)}

{/* Faculty Edit Modal */}
      {showEditModal && editingFaculty && (
        <div className="admin-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveChanges} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-admin-900">Edit Faculty Details</h3>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="text-admin-1000 hover:text-admin-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="admin-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editingFaculty.fullName}
                    onChange={handleUpdateChange}
                    className="admin-input"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="admin-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editingFaculty.email}
                    onChange={handleUpdateChange}
                    className="admin-input"
                  />
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="admin-label">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={editingFaculty.title}
                    onChange={handleUpdateChange}
                    className="admin-input"
                  />
                </div>

                {/* Expertise Tags */}
                <div>
                  <label htmlFor="expertiseTags" className="admin-label">
                    Expertise Tags (comma-separated)
                  </label>
                  <textarea
                    id="expertiseTags"
                    name="expertiseTags"
                    value={editingFaculty.expertiseTags}
                    onChange={handleUpdateChange}
                    className="admin-input"
                    rows="3"
                  ></textarea>
                </div>

                {/* Availability Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={editingFaculty.isAvailable}
                    onChange={handleUpdateChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-admin-900">
                    Is Available
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-admin-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="admin-button-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-button-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;
