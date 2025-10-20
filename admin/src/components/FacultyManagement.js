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

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockFaculty = [
          {
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@email.com',
            expertise: ['Mathematics', 'Physics', 'Calculus'],
            rating: 4.8,
            totalBookings: 156,
            earnings: 12500,
            status: 'active',
            joinDate: '2023-01-15',
            profileImage: null,
            services: [
              { name: 'Calculus Tutoring', price: 50, duration: 60 },
              { name: 'Physics Help', price: 45, duration: 45 },
              { name: 'Math Review', price: 40, duration: 30 }
            ]
          },
          {
            id: 2,
            name: 'Prof. Michael Chen',
            email: 'michael.chen@email.com',
            expertise: ['Computer Science', 'Programming', 'Data Structures'],
            rating: 4.9,
            totalBookings: 203,
            earnings: 18900,
            status: 'active',
            joinDate: '2022-11-20',
            profileImage: null,
            services: [
              { name: 'Python Programming', price: 60, duration: 60 },
              { name: 'Data Structures', price: 55, duration: 60 },
              { name: 'Algorithm Design', price: 70, duration: 90 }
            ]
          },
          {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            email: 'emily.rodriguez@email.com',
            expertise: ['Chemistry', 'Organic Chemistry', 'Biochemistry'],
            rating: 4.7,
            totalBookings: 98,
            earnings: 8200,
            status: 'active',
            joinDate: '2023-03-10',
            profileImage: null,
            services: [
              { name: 'Organic Chemistry', price: 55, duration: 60 },
              { name: 'General Chemistry', price: 45, duration: 45 },
              { name: 'Lab Techniques', price: 50, duration: 60 }
            ]
          },
          {
            id: 4,
            name: 'Prof. David Kim',
            email: 'david.kim@email.com',
            expertise: ['Economics', 'Business', 'Finance'],
            rating: 4.6,
            totalBookings: 134,
            earnings: 11200,
            status: 'inactive',
            joinDate: '2022-09-05',
            profileImage: null,
            services: [
              { name: 'Microeconomics', price: 50, duration: 60 },
              { name: 'Macroeconomics', price: 50, duration: 60 },
              { name: 'Financial Analysis', price: 65, duration: 90 }
            ]
          }
        ];
        
        setFaculty(mockFaculty);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching faculty:', error);
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewFaculty = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "admin-badge";
    switch (status) {
      case 'active':
        return `${baseClasses} admin-badge-success`;
      case 'inactive':
        return `${baseClasses} admin-badge-warning`;
      case 'suspended':
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
        <div className="flex items-center space-x-3">
          <button className="admin-button-primary">
            Add New Faculty
          </button>
        </div>
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
          
          <div className="flex items-center space-x-3">
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
          </div>
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((facultyMember) => (
          <div key={facultyMember.id} className="admin-card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  {facultyMember.profileImage ? (
                    <img
                      src={facultyMember.profileImage}
                      alt={facultyMember.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-primary-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-admin-900">{facultyMember.name}</h3>
                  <p className="text-sm text-admin-600">{facultyMember.email}</p>
                </div>
              </div>
              <span className={getStatusBadge(facultyMember.status)}>
                {facultyMember.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-admin-600 mb-1">Expertise</p>
                <div className="flex flex-wrap gap-1">
                  {facultyMember.expertise.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-admin-100 text-admin-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {facultyMember.expertise.length > 3 && (
                    <span className="px-2 py-1 bg-admin-100 text-admin-700 text-xs rounded-full">
                      +{facultyMember.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-admin-600">Rating</p>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-semibold">{facultyMember.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-admin-600">Bookings</p>
                  <p className="font-semibold">{facultyMember.totalBookings}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-admin-200">
                <div>
                  <p className="text-sm text-admin-600">Earnings</p>
                  <p className="font-semibold text-green-600">
                    ${facultyMember.earnings.toLocaleString()}
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
                    className="p-2 text-admin-600 hover:bg-admin-100 rounded-lg"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
                  className="text-admin-400 hover:text-admin-600"
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
                        alt={selectedFaculty.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-admin-900">
                      {selectedFaculty.name}
                    </h4>
                    <p className="text-admin-600">{selectedFaculty.email}</p>
                    <span className={getStatusBadge(selectedFaculty.status)}>
                      {selectedFaculty.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-admin-600">Rating</p>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-semibold">{selectedFaculty.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-admin-600">Total Bookings</p>
                    <p className="font-semibold">{selectedFaculty.totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-600">Total Earnings</p>
                    <p className="font-semibold text-green-600">
                      ${selectedFaculty.earnings.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-admin-600">Join Date</p>
                    <p className="font-semibold">
                      {new Date(selectedFaculty.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-admin-600 mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-admin-600 mb-2">Services</p>
                  <div className="space-y-2">
                    {selectedFaculty.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-admin-50 rounded-lg">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-admin-600">{service.duration} minutes</p>
                        </div>
                        <p className="font-semibold text-green-600">${service.price}</p>
                      </div>
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
                <button className="admin-button-primary">
                  Edit Faculty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;
