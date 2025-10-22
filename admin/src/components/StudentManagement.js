import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  TagIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    active: 0
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/students?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&status=${filterStatus}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/students/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleToggleVerification = async (studentId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isVerified: !currentStatus })
      });

      if (response.ok) {
        fetchStudents();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/students/${studentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (response.ok) {
          fetchStudents();
          fetchStats();
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }) => (
    <div className="admin-stats-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-admin-600">{title}</p>
          <p className="text-2xl font-bold text-admin-900">{(value || 0).toLocaleString()}</p>
          {trend && (
            <p className="text-xs text-admin-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="admin-loading"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-admin-900">Student Management</h1>
          <p className="text-admin-600">Manage and monitor student accounts</p>
        </div>
        <button className="admin-button-primary">
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.total}
          icon={UsersIcon}
          color="blue"
          trend="+12% from last month"
        />
        <StatCard
          title="Verified Students"
          value={stats.verified}
          icon={CheckCircleIcon}
          color="green"
          trend={`${Math.round(((stats.verified || 0) / (stats.total || 1)) * 100)}% of total`}
        />
        <StatCard
          title="Pending Verification"
          value={stats.unverified}
          icon={ExclamationTriangleIcon}
          color="yellow"
          trend="Needs attention"
        />
        <StatCard
          title="Active Students"
          value={stats.active}
          icon={AcademicCapIcon}
          color="purple"
          trend="Recently active"
        />
      </div>

      {/* Filters and Search */}
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-admin-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="admin-input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-admin-400" />
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="admin-input pl-10 pr-8"
              >
                <option value="all">All Students</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Pending Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-admin-200">
            <thead className="bg-admin-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-admin-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-admin-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-admin-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={student.profileImage || '/default-avatar.png'}
                          alt={student.fullName}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-admin-900">
                          {student.fullName}
                        </div>
                        <div className="text-sm text-admin-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-admin-900">
                      <BuildingOfficeIcon className="h-4 w-4 mr-2 text-admin-400" />
                      {student.university || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-admin-900">
                      <AcademicCapIcon className="h-4 w-4 mr-2 text-admin-400" />
                      {student.program || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student.isVerified)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-500">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 mr-2 text-admin-400" />
                      {formatDate(student.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVerification(student._id, student.isVerified)}
                        className={`${student.isVerified ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={student.isVerified ? 'Unverify' : 'Verify'}
                      >
                        {student.isVerified ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                      </button>
                      <button
                         onClick={() => handleDeleteStudent(student._id)}
                         className="text-red-600 hover:text-red-900"
                         title="Delete Student"
                       >
                         <TrashIcon className="h-4 w-4" />
                       </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>

           {/* No students found message */}
           {students.length === 0 && !loading && (
             <div className="text-center py-8 text-admin-500">
               No students found.
             </div>
           )}
         </div>

         {/* Pagination */}
         <div className="flex justify-between items-center mt-6">
           <button
             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
             disabled={currentPage === 1}
             className="admin-button-secondary"
           >
             Previous
           </button>
           <p className="text-sm text-admin-500">
             Page {currentPage} of {totalPages}
           </p>
           <button
             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
             disabled={currentPage === totalPages}
             className="admin-button-secondary"
           >
             Next
           </button>
         </div>
       </div>

       {/* Student Details Modal */}
       {showModal && selectedStudent && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
             <button
               onClick={() => setShowModal(false)}
               className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
             >
               ✕
             </button>

             <div className="flex flex-col items-center space-y-4">
               <img
                 src={selectedStudent.profileImage || '/default-avatar.png'}
                 alt={selectedStudent.fullName}
                 className="w-24 h-24 rounded-full"
               />
               <h2 className="text-xl font-bold text-admin-900">
                 {selectedStudent.fullName}
               </h2>
               <p className="text-admin-600">{selectedStudent.email}</p>

               <div className="w-full border-t border-admin-200 pt-4 space-y-2 text-sm">
                 <p>
                   <strong>University:</strong> {selectedStudent.university || 'Not specified'}
                 </p>
                 <p>
                   <strong>Program:</strong> {selectedStudent.program || 'Not specified'}
                 </p>
                 <p>
                   <strong>Status:</strong> {selectedStudent.isVerified ? 'Verified' : 'Pending'}
                 </p>
                 <p>
                   <strong>Joined:</strong> {formatDate(selectedStudent.createdAt)}
                 </p>
               </div>

               <div className="flex justify-end space-x-2 mt-4">
                 <button
                   onClick={() =>
                     handleToggleVerification(selectedStudent._id, selectedStudent.isVerified)
                   }
                   className={`admin-button-${
                     selectedStudent.isVerified ? 'warning' : 'success'
                   }`}
                 >
                   {selectedStudent.isVerified ? 'Unverify' : 'Verify'}
                 </button>
                 <button
                   onClick={() => handleDeleteStudent(selectedStudent._id)}
                   className="admin-button-danger"
                 >
                   Delete
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

 export default StudentManagement;
      