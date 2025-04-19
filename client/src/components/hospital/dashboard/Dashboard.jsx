import React, { useEffect, useState } from 'react';
import { Search, Plus, Bell, Settings, User, Loader, AlertCircle, Check, X, Filter, Download, MoreHorizontal, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const [staff, setStaff] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRequests, setShowRequests] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const auth = useAuth();
  const userId = auth.user?._id;

  useEffect(() => {
    if (userId) {
      fetchDoctors();
      fetchRequests();
    }
  }, [userId]);

  // Clear alert after 3 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/hospitals/${userId}/requests`);

      if (response.data && Array.isArray(response.data)) {
        console.log("Requests fetched:", response.data);
        setRequests(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        setRequests([]);
        setAlert({
          type: 'error',
          message: 'Failed to load requests: Invalid data format',
        });
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setRequests([]);
      setAlert({
        type: 'error',
        message: 'Failed to fetch join requests',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (request, status) => {
    try {
      const doctorId = request.doctorId || request._id;

      if (!doctorId) {
        throw new Error('Invalid request data: Missing doctor ID');
      }

      console.log(`Processing request for doctor ${doctorId} with status: ${status}`);

      const response = await axios.put(`http://localhost:5000/api/doctor/profile/${doctorId}`, {
        status,
        hospitals: [userId],
      });

      if (response.status !== 200) throw new Error('Failed to update request');

      // Refresh requests and staff list
      fetchRequests();
      if (status === 'accepted') fetchDoctors();

      // Show success message
      const message = status === 'accepted' ? 'Request accepted successfully' : 'Request rejected';
      setAlert({
        type: status === 'accepted' ? 'success' : 'info',
        message,
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: `Failed to process request: ${err.message}`,
      });
      console.error('Error handling request:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const hospitalResponse = await axios.get(`http://localhost:5000/api/hospitals/${userId}`);
      const hospitalData = hospitalResponse.data;

      if (!hospitalData.doctors || hospitalData.doctors.length === 0) {
        setStaff([]);
        setLoading(false);
        return;
      }

      const doctorsPromises = hospitalData.doctors.map(async (doctorId) => {
        const doctorResponse = await axios.get(`http://localhost:5000/api/doctor/profile/${doctorId}`);
        return doctorResponse.data;
      });

      const doctorsDetails = await Promise.all(doctorsPromises);
      setStaff(doctorsDetails);
    } catch (err) {
      setError('Failed to fetch staff data. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportStaffData = () => {
    setIsExporting(true);

    try {
      // Create CSV content
      const headers = ['Name', 'Specialization', 'Email', 'Status'];
      const csvContent = [
        headers.join(','),
        ...filteredStaff.map(member =>
          [
            member.name,
            member.specialization || member.role || 'N/A',
            member.email,
            member.status || 'On Leave'
          ].join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'staff_data.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setAlert({
        type: 'success',
        message: 'Staff data exported successfully',
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to export staff data',
      });
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Filter staff based on search term and selected filter
  const filteredStaff = staff.filter(member => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.specialization || member.role || '')?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && member.status?.toLowerCase() === 'active') ||
      (selectedFilter === 'on leave' && (!member.status || member.status?.toLowerCase() === 'on leave'));

    return matchesSearch && matchesFilter;
  });

  // Alert Component
  const AlertComponent = ({ message, type }) => {
    const bgColor =
      type === 'success'
        ? 'bg-green-100'
        : type === 'error'
          ? 'bg-red-100'
          : 'bg-blue-100';
    const textColor =
      type === 'success'
        ? 'text-green-800'
        : type === 'error'
          ? 'text-red-800'
          : 'text-blue-800';
    const Icon =
      type === 'success'
        ? Check
        : type === 'error'
          ? X
          : AlertCircle;

    return (
      <div className={`fixed top-4 right-4 ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-md z-50 flex items-center`}>
        <Icon className="h-5 w-5 mr-2" />
        {message}
      </div>
    );
  };

  // Modal for staff details
  const StaffDetailsModal = ({ member, onClose }) => {
    if (!member) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Staff Details</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-indigo-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{member.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium">{member.specialization || member.role || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{member.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${member.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {member.status || 'On Leave'}
                </p>
              </div>
              {member.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{member.phone}</p>
                </div>
              )}
              {member.joinDate && (
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium">{new Date(member.joinDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Request Card Component
  const RequestCard = ({ request }) => {
    if (!request) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{request.doctorName || 'Unknown Doctor'}</h3>
            <p className="text-sm text-gray-500">{request.specialization || 'No specialization'}</p>
            <p className="text-sm text-gray-500 mt-1">{request.email || 'No email provided'}</p>
            <p className="text-xs text-gray-400 mt-1">ID: {request.doctorId || request._id || 'Unknown'}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleRequest(request, 'accepted')}
              className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
              title="Accept Request"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleRequest(request, 'rejected')}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              title="Reject Request"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Requests Panel
  const RequestsPanel = () => (
    <div
      className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20"
      style={{ transform: showRequests ? 'translateX(0)' : 'translateX(100%)' }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Join Requests</h2>
            <button onClick={() => setShowRequests(false)} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500">Manage doctors who want to join your hospital</p>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
              <p className="text-sm text-gray-500 mt-2">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <Bell className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="text-gray-600">No pending requests</p>
              <p className="text-sm text-gray-500 mt-1">New join requests will appear here</p>
              <button
                onClick={fetchRequests}
                className="mt-4 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 text-sm"
              >
                Refresh
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {requests.length} request{requests.length !== 1 ? 's' : ''} found
                </p>
                <button
                  onClick={fetchRequests}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Refresh
                </button>
              </div>
              <div className="space-y-4">
                {requests.map((request) => (
                  <RequestCard key={request._id || request.doctorId} request={request} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Debug panel - can be removed in production */}
        <div className="p-3 border-t text-xs bg-gray-50">
          <details>
            <summary className="text-gray-500 cursor-pointer">Debug Info</summary>
            <div className="mt-2 text-gray-600 overflow-auto max-h-40">
              <p>User ID: {userId || 'Not set'}</p>
              <p>Requests Count: {requests.length}</p>
              <pre className="mt-2 text-xs whitespace-pre-wrap">
                {JSON.stringify(requests, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Alert */}
      {alert && <AlertComponent message={alert.message} type={alert.type} />}

      {/* Staff Details Modal */}
      {selectedMember && (
        <StaffDetailsModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-1">
              <span className="text-2xl font-bold text-indigo-600">medi</span>
              <span className="text-2xl font-bold text-gray-800">Connect</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRequests(!showRequests)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="View Join Requests"
              >
                <Bell className="h-5 w-5 text-gray-500 hover:text-indigo-600" />
                {requests.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {requests.length}
                  </span>
                )}
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5 text-gray-500 hover:text-indigo-600" />
              </button>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-200 transition-colors">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">
              {loading ? 'Loading staff data...' : `Total Staff: ${staff.length}`}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportStaffData}
              disabled={isExporting || loading || staff.length === 0}
              className={`flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${(isExporting || loading || staff.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isExporting ? (
                <Loader className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
              <Plus className="h-5 w-5 mr-2" />
              Add Staff
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or specialization..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="relative min-w-[160px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Staff</option>
                <option value="active">Active</option>
                <option value="on leave">On Leave</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 min-h-[400px] space-y-4">
            <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading staff details...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 min-h-[400px] space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <p className="text-red-600 font-medium text-center">{error}</p>
            <button
              onClick={fetchDoctors}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 min-h-[400px] space-y-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="text-gray-700 font-medium">No staff members found</p>
            <p className="text-gray-500 text-center">Start by adding staff members to your hospital</p>
            <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
              <Plus className="h-5 w-5 mr-2 inline-block" />
              Add First Staff Member
            </button>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-10 min-h-[400px] space-y-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-gray-700 font-medium">No results found</p>
            <p className="text-gray-500 text-center">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.specialization || member.role || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="relative group">
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal className="h-5 w-5 text-gray-500" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Edit Profile
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Change Status
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Remove Staff
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <div className="mt-3 flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {member.status || 'On Leave'}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="w-full py-3 text-center text-indigo-600 font-medium hover:bg-indigo-50 transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requests Panel */}
      <RequestsPanel />

      {/* Overlay when requests panel is open */}
      {showRequests && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 transition-opacity duration-300 ease-in-out"
          onClick={() => setShowRequests(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;