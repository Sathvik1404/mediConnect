import React, { useEffect, useState } from 'react';
import { Search, Plus, Filter, Bell, Settings, User, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../../AuthContext';

const Dashboard = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const auth = useAuth();
  const userId = auth.user?._id;

  useEffect(() => {
    if (userId) {
      fetchDoctors();
    }
  }, [userId]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const hospitalResponse = await fetch(`http://localhost:5000/api/hospitals/${userId}`);
      if (!hospitalResponse.ok) {
        throw new Error('Failed to fetch hospital details');
      }
      const hospitalData = await hospitalResponse.json();

      const doctorsPromises = hospitalData.doctors.map(async (doctorId) => {
        const doctorResponse = await fetch(`http://localhost:5000/api/doctor/profile/${doctorId}`);
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

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && member.status?.toLowerCase() === selectedFilter.toLowerCase();
  });

  // Loading State Component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      <p className="text-gray-600">Loading staff details...</p>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
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
  );

  // Staff Card Component
  const StaffCard = ({ member }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-bold text-indigo-600">mediConnect</span>
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-indigo-600" />
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
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No staff members found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <StaffCard key={member._id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;