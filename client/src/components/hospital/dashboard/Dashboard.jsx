import React, { useEffect, useState } from 'react';
import { Search, Plus, Bell, Settings, User, Loader, AlertCircle, Check, X } from 'lucide-react';
import { useAuth } from '../../AuthContext';

const Dashboard = () => {
  const [staff, setStaff] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRequests, setShowRequests] = useState(false);
  const [alert, setAlert] = useState(null);
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
      const response = await fetch(`https://mediconnect-but5.onrender.com/api/hospitals/${userId}/requests`);
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const handleRequest = async (request, status) => {
    // console.log(request)
    try {
      const response = await fetch(`https://mediconnect-but5.onrender.com/api/doctor/profile/${request.doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, hospitals: [userId] }),
      });

      if (!response.ok) throw new Error('Failed to update request');

      // Refresh requests and staff list
      fetchRequests();
      if (status === 'accepted') fetchDoctors();

      // Show success message
      const message = status === 'accepted' ? 'Request accepted successfully' : 'Request rejected';
      setAlert({
        type: status === 'accepted' ? 'success' : 'info',
        message
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to process request'
      });
      console.error('Error handling request:', err);
    }
  };

  // Alert Component
  const AlertComponent = ({ message, type }) => {
    const bgColor = type === 'success' ? 'bg-green-100' :
      type === 'error' ? 'bg-red-100' :
        'bg-blue-100';
    const textColor = type === 'success' ? 'text-green-800' :
      type === 'error' ? 'text-red-800' :
        'text-blue-800';

    return (
      <div className={`fixed top-4 right-4 ${bgColor} ${textColor} px-4 py-2 rounded-lg shadow-md z-50`}>
        {message}
      </div>
    );
  };

  // Previous fetch doctors function remains the same
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const hospitalResponse = await fetch(`https://mediconnect-but5.onrender.com/api/hospitals/${userId}`);
      if (!hospitalResponse.ok) {
        throw new Error('Failed to fetch hospital details');
      }
      const hospitalData = await hospitalResponse.json();
      // console.log(hospitalData.doctors)

      const doctorsPromises = hospitalData.doctors.map(async (doctorId) => {
        const doctorResponse = await fetch(`https://mediconnect-but5.onrender.com/api/doctor/profile/${doctorId}`);
        if (!doctorResponse.ok) {
          throw new Error(`Failed to fetch doctor with id ${doctorId}`);
        }
        return doctorResponse.json();
      });

      const doctorsDetails = await Promise.all(doctorsPromises);
      setStaff(doctorsDetails);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Request Card Component
  const RequestCard = ({ request }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{request.doctorName}</h3>
          <p className="text-sm text-gray-500">{request.specialization}</p>
          <p className="text-sm text-gray-500 mt-1">{request.email}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleRequest(request, 'accepted')}
            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleRequest(request._id, 'rejected')}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Requests Panel
  const RequestsPanel = () => (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-200 ease-in-out"
      style={{ transform: showRequests ? 'translateX(0)' : 'translateX(100%)' }}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Join Requests</h2>
          <button
            onClick={() => setShowRequests(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center">No pending requests</p>
          ) : (
            requests.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Alert */}
      {alert && <AlertComponent message={alert.message} type={alert.type} />}

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-bold text-indigo-600">mediConnect</span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRequests(!showRequests)}
                className="relative"
              >
                <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-indigo-600" />
                {requests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {requests.length}
                  </span>
                )}
              </button>
              <Settings className="h-5 w-5 text-gray-500 cursor-pointer hover:text-indigo-600" />
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Total Staff: {staff.length}</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
            <Plus className="h-5 w-5 mr-2" />
            Add Staff
          </button>
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
                placeholder="Search by name, email, or department..."
                className="pl-10 w-full h-10 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="h-10 px-4 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Staff</option>
              <option value="active">Active</option>
              <option value="on leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Loading staff details...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchDoctors}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : (staff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No staff members found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <div key={member._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.specialization || member.role}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {member.status || 'On Leave'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Department: </span>
                    <span className="text-gray-700">{member.department || member.specialization}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Email: </span>
                    <span className="text-gray-700">{member.email}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Experience: </span>
                    <span className="text-gray-700">{member.experience || 'N/A'} years</span>
                  </div>
                </div>

                <button className="mt-4 w-full px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Requests Panel */}
      <RequestsPanel />
    </div>
  );
};

export default Dashboard;