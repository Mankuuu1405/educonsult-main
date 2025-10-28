import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios'; // Using axios for API requests

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Using the actual backend endpoint
        const { data } = await axios.get('/api/admin/students');
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term in fullName or email
  const filteredStudents = students.filter(student => {
    if (!student || !student.fullName || !student.email) {
        return false;
    }
    const fullNameMatch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return fullNameMatch || emailMatch;
  });

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      // Using the actual backend endpoint for deletion
      await axios.delete(`/api/admin/students/${studentId}`);
      
      // Update the state to remove the deleted student from the UI
      setStudents(currentStudents => currentStudents.filter(s => s._id !== studentId));

    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please try again.');
    }
  };
  
  // Updated function to handle 'isVerified' boolean
  const getStatusBadge = (isVerified) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    if (isVerified) {
      return `${baseClasses} bg-green-100 text-green-700`; // Verified
    }
    return `${baseClasses} bg-yellow-100 text-yellow-700`; // Not Verified
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-600">View and manage all students in the system.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <UserCircleIcon className="h-10 w-10 text-gray-300" />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(student.isVerified)}>
                    {student.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewStudent(student)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Student"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-16 w-16 text-gray-300" />
                  </div>
                  <div>
                      <h4 className="text-xl font-semibold">{selectedStudent.fullName}</h4>
                      <p className="text-gray-600">{selectedStudent.email}</p>
                      <span className={getStatusBadge(selectedStudent.isVerified)}>
                        {selectedStudent.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                  </div>
              </div>
              
              <div>
                  <p className="text-sm text-gray-600">Joined On</p>
                  <p className="font-semibold">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
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