import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Bell, Settings, User, Loader, AlertCircle, Check, X,
  Filter, Download, MoreHorizontal, RefreshCcw, Calendar, Clipboard,
  Activity, Users, Clock, Trash, CheckCircle, AlertTriangle, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import axios from 'axios';

// Set up a base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance for consistent headers and error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

const Dashboard = () => {
  // State management
  const [staff, setStaff] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState({
    staff: true,
    requests: true,
    action: false
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showRequests, setShowRequests] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [viewMode, setViewMode] = useState('grid');
  const [dashboardStats, setDashboardStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    pendingRequests: 0,
    departments: []
  });
  const [confirmDialog, setConfirmDialog] = useState(null);

  const auth = useAuth();
  const userId = auth.user?._id;
  const { logout } = auth;
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    if (userId) {
      fetchDoctors();
      fetchRequests();
      fetchDashboardStats();
    }
  }, [userId]);

  // Clear alert after timeout
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Fetch hospital dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await apiClient.get(`/hospitals/${userId}/stats`);
      setDashboardStats(response.data || {
        totalStaff: staff.length,
        activeStaff: staff.filter(member => member.status === 'Active').length,
        pendingRequests: requests.length,
        departments: []
      });
    } catch (err) {
      // If the stats endpoint isn't available, calculate from existing data
      setDashboardStats({
        totalStaff: staff.length,
        activeStaff: staff.filter(member => member.status === 'Active').length,
        pendingRequests: requests.length,
        departments: Array.from(new Set(staff.map(member => member.specialization || member.role))).filter(Boolean)
      });
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(prev => ({ ...prev, action: true }));

      // Call logout function from auth context
      await auth.logout();

      // Show success message
      showAlert('success', 'Logged out successfully');

      // Redirect to login page or home page
      navigate('/hospital/hlogin');
    } catch (err) {
      showAlert('error', `Logout failed: ${err.message}`);
      console.error('Logout error:', err);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Fetch join requests
  const fetchRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, requests: true }));
      const response = await apiClient.get(`/hospitals/${userId}/requests`);

      if (response.data && Array.isArray(response.data)) {
        console.log("Requests fetched:", response.data);
        setRequests(response.data);
      } else {
        console.error("Invalid response format:", response.data);
        setRequests([]);
        showAlert('error', 'Failed to load requests: Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
      setRequests([]);
      showAlert('error', 'Failed to fetch join requests');
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  // Handle request acceptance/rejection
  const handleRequest = async (request, status) => {
    // Show confirmation dialog
    setConfirmDialog({
      title: `${status === 'accepted' ? 'Accept' : 'Reject'} Request`,
      message: `Are you sure you want to ${status === 'accepted' ? 'accept' : 'reject'} the request from Dr. ${request.doctorName || 'Unknown'}?`,
      confirmText: status === 'accepted' ? 'Accept' : 'Reject',
      confirmVariant: status === 'accepted' ? 'success' : 'danger',
      onConfirm: async () => {
        try {
          setLoading(prev => ({ ...prev, action: true }));
          const doctorId = request.doctorId || request._id;
          const doctor = await axios.get(`http://localhost:5000/api/doctor/profile/${doctorId}`)
          if (!doctorId) {
            throw new Error('Invalid request data: Missing doctor ID');
          }

          console.log(`Processing request for doctor ${doctorId} with status: ${status}`);

          if (status !== 'reject') {
            var response = await apiClient.put(`/doctor/profile/${doctorId}`, {
              status,
              hospitals: userId,
            });
          }

          if (response.status !== 200) throw new Error('Failed to update request');

          // Remove the current request from the list
          // setRequests(prevRequests => prevRequests.filter(req => req._id !== request._id));
          await apiClient.delete(`/hospitals/requests/${request._id}`)

          // Refresh requests and staff list
          fetchRequests();
          if (status === 'accepted') fetchDoctors();

          // Update dashboard stats
          // fetchDashboardStats();

          // Show success message
          const message = status === 'accepted' ? 'Request accepted successfully' : 'Request rejected';
          showAlert(status === 'accepted' ? 'success' : 'info', message);

          // Close confirmation dialog
          setConfirmDialog(null);
        } catch (err) {
          showAlert('error', `Failed to process request: ${err.message}`);
          console.error('Error handling request:', err);
          setConfirmDialog(null);
        } finally {
          setLoading(prev => ({ ...prev, action: false }));
        }
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  // Fetch doctors/staff data
  const fetchDoctors = async () => {
    try {
      setLoading(prev => ({ ...prev, staff: true }));
      setError(null);

      const hospitalResponse = await apiClient.get(`/hospitals/${userId}`);
      const hospitalData = hospitalResponse.data;

      if (!hospitalData.doctors || hospitalData.doctors.length === 0) {
        setStaff([]);
        setLoading(prev => ({ ...prev, staff: false }));
        return;
      }

      const doctorsPromises = hospitalData.doctors.map(async (doctorId) => {
        const doctorResponse = await apiClient.get(`/doctor/profile/${doctorId}`);
        return doctorResponse.data;
      });

      const doctorsDetails = await Promise.all(doctorsPromises);
      console.log(doctorsDetails)
      setStaff(doctorsDetails);
    } catch (err) {
      setError('Failed to fetch staff data. Please try again.');
      console.error('Error:', err);
      showAlert('error', 'Failed to load staff data');
    } finally {
      setLoading(prev => ({ ...prev, staff: false }));
    }
  };

  // Export staff data to CSV
  const exportStaffData = () => {
    setIsExporting(true);

    try {
      // Create CSV content
      const headers = ['Name', 'Specialization', 'Email', 'Status', 'Phone', 'Join Date'];
      const csvContent = [
        headers.join(','),
        ...filteredStaff.map(member =>
          [
            `"${member.name || 'N/A'}"`,
            `"${member.specialization || member.role || 'N/A'}"`,
            `"${member.email || 'N/A'}"`,
            `"${member.status || 'On Leave'}"`,
            `"${member.phone || 'N/A'}"`,
            `"${member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}"`
          ].join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `hospital_staff_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showAlert('success', 'Staff data exported successfully');
    } catch (err) {
      showAlert('error', 'Failed to export staff data');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper for displaying alerts
  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  // Remove staff member 
  const removeStaffMember = async (member) => {
    // Show confirmation dialog
    setConfirmDialog({
      title: "Remove Staff Member",
      message: `Are you sure you want to remove ${member.name} from your hospital staff? This action cannot be undone.`,
      confirmText: "Remove",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          setLoading(prev => ({ ...prev, action: true }));

          const doctor = await apiClient.get(`/doctor/profile/${member._id}`)
          const hospital = await apiClient.get(`/hospitals/${userId}`)
          // In a real app, this would be an API call
          // await apiClient.put(`/hospitals/${userId}`,);
          await apiClient.put(`/hospitals/${userId}`, {
            doctors: hospital.data.doctors.filter(doctorId => doctorId !== member._id),
          });

          await apiClient.put(`/doctor/profile/${member._id}`, {
            hospitals: '',
          });

          // Update staff list
          setStaff(staff.filter(s => s._id !== member._id));

          // Update dashboard stats
          fetchDashboardStats();

          showAlert('info', `${member.name} has been removed from staff`);

          // Close any open modals
          setSelectedMember(null);
          setConfirmDialog(null);
        } catch (err) {
          showAlert('error', `Failed to remove staff member: ${err.message}`);
          console.error('Error removing staff:', err);
          setConfirmDialog(null);
        } finally {
          setLoading(prev => ({ ...prev, action: false }));
        }
      },
      onCancel: () => setConfirmDialog(null)
    });
  };

  // Update staff member status
  const updateStaffStatus = async (member, newStatus) => {
    try {
      setLoading(prev => ({ ...prev, action: true }));

      // In a real app, this would be an API call
      await apiClient.put(`/doctor/profile/${member._id}`, {
        status: newStatus
      });

      // Update local state
      setStaff(staff.map(s =>
        s._id === member._id ? { ...s, status: newStatus } : s
      ));

      showAlert('success', `Status updated successfully`);

      // Close detail modal if open
      if (selectedMember && selectedMember._id === member._id) {
        setSelectedMember({ ...selectedMember, status: newStatus });
      }
    } catch (err) {
      showAlert('error', `Failed to update status: ${err.message}`);
      console.error('Error updating status:', err);
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Get all specializations for filter dropdown
  const specializations = useMemo(() => {
    if (!staff.length) return [];
    return Array.from(new Set(
      staff
        .map(member => member.specialization || member.role)
        .filter(Boolean)
    )).sort();
  }, [staff]);

  // Sort staff members
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting
  const filteredStaff = useMemo(() => {
    return staff
      .filter(member => {
        // Search filter
        const matchesSearch =
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.specialization || member.role || '')?.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'active' && member.status?.toLowerCase() === 'active') ||
          (statusFilter === 'on leave' && (!member.status || member.status?.toLowerCase() === 'on leave'));

        // Specialty filter
        const matchesSpecialty =
          specialtyFilter === 'all' ||
          (member.specialization || member.role)?.toLowerCase() === specialtyFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesSpecialty;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'ascending'
            ? (a.name || '').localeCompare(b.name || '')
            : (b.name || '').localeCompare(a.name || '');
        }
        if (sortConfig.key === 'specialization') {
          const specA = a.specialization || a.role || '';
          const specB = b.specialization || b.role || '';
          return sortConfig.direction === 'ascending'
            ? specA.localeCompare(specB)
            : specB.localeCompare(specA);
        }
        if (sortConfig.key === 'status') {
          const statusA = a.status || 'On Leave';
          const statusB = b.status || 'On Leave';
          return sortConfig.direction === 'ascending'
            ? statusA.localeCompare(statusB)
            : statusB.localeCompare(statusA);
        }
        return 0;
      });
  }, [staff, searchTerm, statusFilter, specialtyFilter, sortConfig]);

  // Stats cards for dashboard overview
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

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

  // Confirmation Dialog
  const ConfirmDialog = () => {
    if (!confirmDialog) return null;

    const { title, message, confirmText, confirmVariant, onConfirm, onCancel } = confirmDialog;

    const confirmButtonClass =
      confirmVariant === 'danger'
        ? 'bg-red-600 hover:bg-red-700'
        : confirmVariant === 'success'
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-indigo-600 hover:bg-indigo-700';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
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
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {member.status || 'On Leave'}
                  </span>
                  <button
                    className="ml-2 text-gray-500 hover:text-indigo-600"
                    onClick={() => {
                      const newStatus = member.status === 'Active' ? 'On Leave' : 'Active';
                      updateStaffStatus(member, newStatus);
                    }}
                  >
                    <RefreshCcw className="h-3 w-3" />
                  </button>
                </div>
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
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Hospital ID</p>
                <p className="font-medium text-xs text-gray-600">{member._id}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={() => removeStaffMember(member)}
                className="w-full px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 flex justify-center items-center"
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove Staff Member
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
              disabled={loading.action}
            >
              {loading.action ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleRequest(request, 'rejected')}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
              title="Reject Request"
              disabled={loading.action}
            >
              {loading.action ? <Loader className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
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
          {loading.requests ? (
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
      </div>
    </div>
  );

  // Table view for staff
  const StaffTableView = () => (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('name')}
            >
              <div className="flex items-center">
                Name
                {sortConfig.key === 'name' && (
                  <ChevronDown
                    className={`h-4 w-4 ml-1 ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`}
                  />
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('specialization')}
            >
              <div className="flex items-center">
                Specialization
                {sortConfig.key === 'specialization' && (
                  <ChevronDown
                    className={`h-4 w-4 ml-1 ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`}
                  />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('status')}
            >
              <div className="flex items-center">
                Status
                {sortConfig.key === 'status' && (
                  <ChevronDown
                    className={`h-4 w-4 ml-1 ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`}
                  />
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStaff.map((member) => (
            <tr key={member._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{member.specialization || member.role || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{member.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {member.status || 'On Leave'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      const newStatus = member.status === 'Active' ? 'On Leave' : 'Active';
                      updateStaffStatus(member, newStatus);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                    title="Toggle Status"
                  >
                    {member.status === 'Active' ? 'Set Leave' : 'Activate'}
                  </button>
                  <button
                    onClick={() => removeStaffMember(member)}
                    className="text-red-600 hover:text-red-900"
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Alert */}
      {alert && <AlertComponent message={alert.message} type={alert.type} />}

      {/* Confirmation Dialog */}
      {confirmDialog && <ConfirmDialog />}

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
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Hospital Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Staff"
              value={dashboardStats.totalStaff || staff.length}
              icon={Users}
              color="bg-indigo-600"
            />
            <StatCard
              title="Active Staff"
              value={dashboardStats.activeStaff || staff.filter(m => m.status === 'Active').length}
              icon={CheckCircle}
              color="bg-green-600"
            />
            <StatCard
              title="On Leave"
              value={(dashboardStats.totalStaff || staff.length) - (dashboardStats.activeStaff || staff.filter(m => m.status === 'Active').length)}
              icon={Clock}
              color="bg-yellow-600"
            />
            <StatCard
              title="Join Requests"
              value={requests.length}
              icon={AlertTriangle}
              color="bg-red-600"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Staff Management</h2>
            <p className="text-gray-600 mt-1">
              {loading.staff ? 'Loading staff data...' : `Showing ${filteredStaff.length} of ${staff.length} staff members`}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportStaffData}
              disabled={isExporting || loading.staff || staff.length === 0}
              className={`flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${(isExporting || loading.staff || staff.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <div className="flex space-x-3">
              <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="on leave">On Leave</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Specialties</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Grid View"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Table View"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content States */}
        {loading.staff ? (
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
                setStatusFilter('all');
                setSpecialtyFilter('all');
              }}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          <StaffTableView />
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
                        <button
                          onClick={() => {
                            const newStatus = member.status === 'Active' ? 'On Leave' : 'Active';
                            updateStaffStatus(member, newStatus);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {member.status === 'Active' ? 'Set to On Leave' : 'Set to Active'}
                        </button>
                        <button
                          onClick={() => removeStaffMember(member)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Remove Staff
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  {member.phone && (
                    <p className="text-sm text-gray-500 mt-1">{member.phone}</p>
                  )}
                  <div className="mt-3 flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {member.status || 'On Leave'}
                    </span>
                    {member.joinDate && (
                      <span className="ml-2 text-xs text-gray-500">
                        Joined: {new Date(member.joinDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-100 flex">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="flex-1 py-3 text-center text-indigo-600 font-medium hover:bg-indigo-50 transition-colors duration-200"
                  >
                    View Details
                  </button>
                  <div className="border-l border-gray-100"></div>
                  <button
                    onClick={() => {
                      const newStatus = member.status === 'Active' ? 'On Leave' : 'Active';
                      updateStaffStatus(member, newStatus);
                    }}
                    className="flex-1 py-3 text-center text-indigo-600 font-medium hover:bg-indigo-50 transition-colors duration-200"
                  >
                    {member.status === 'Active' ? 'Set Leave' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - if needed */}
        {filteredStaff.length > 0 && filteredStaff.length < staff.length && (
          <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredStaff.length}</span> of <span className="font-medium">{staff.length}</span> staff members
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSpecialtyFilter('all');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Show All
              </button>
            </div>
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