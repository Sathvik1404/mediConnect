import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  FileText,
  Activity,
  MessageSquare,
  User,
  Pill,
  Bell,
  Heart,
  Search,
  ChevronRight,
  BarChart
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [state, setState] = useState({
    hospitals: [],
    doctors: [],
    selectedHospital: null,
    appointments: [],
    medications: [
      { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", remaining: 15 },
      { id: 2, name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", remaining: 8 },
      { id: 3, name: "Metformin", dosage: "500mg", frequency: "Twice daily", remaining: 22 }
    ],
    recentActivities: [
      { id: 1, type: "Lab Results", description: "Blood Test Results Uploaded", date: "Mar 18, 2025" },
      { id: 2, type: "Visit Summary", description: "General Checkup with Dr. Williams", date: "Mar 15, 2025" },
      { id: 3, type: "Message", description: "Response from Dr. Johnson", date: "Mar 12, 2025" }
    ],
    healthMetrics: [
      { name: "Blood Pressure", value: "120/80 mmHg", trend: "stable", date: "Mar 20, 2025" },
      { name: "Weight", value: "165 lbs", trend: "decreasing", date: "Mar 19, 2025" },
      { name: "Blood Glucose", value: "95 mg/dL", trend: "stable", date: "Mar 18, 2025" },
      { name: "Heart Rate", value: "72 bpm", trend: "stable", date: "Mar 20, 2025" }
    ],
    notifications: [
      { id: 1, type: "appointment", message: "Appointment reminder: Dr. Sarah Johnson tomorrow at 10:30 AM" },
      { id: 2, type: "medication", message: "Atorvastatin refill needed - 8 days remaining" },
      { id: 3, type: "message", message: "New message from Dr. Michael Chen regarding your last visit" }
    ],
    loading: false,
    error: null
  });

  const handleError = useCallback((error, errorMessage) => {
    console.error(error);
    setState(prev => ({ ...prev, error: errorMessage, loading: false }));
  }, []);

  const fetchData = useCallback(async (url, errorMessage) => {
    try {
      const response = await axios.get(url);
      console.log(response)
      return response.data;
    } catch (error) {
      handleError(error, `Error fetching ${errorMessage}`);
      return null;
    }
  }, [handleError]);

  const fetchHospitals = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    const data = await fetchData('http://localhost:5000/api/hospitals', 'hospitals');
    if (data) {
      setState(prev => ({
        ...prev,
        hospitals: data,
        loading: false,
        error: null
      }));
    }
  }, [fetchData]);

  const fetchDoctors = useCallback(async (hospitalId) => {
    setState(prev => ({ ...prev, loading: true }));

    const hospitalData = await fetchData(
      `http://localhost:5000/api/hospitals/${hospitalId}`,
      'hospital details'
    );

    if (!hospitalData) return;

    const doctorPromises = hospitalData.doctors.map(doctorId =>
      fetchData(`http://localhost:5000/api/doctor/profile/${doctorId}`, `doctor ${doctorId}`)
    );

    const doctorsDetails = await Promise.all(doctorPromises);
    const validDoctors = doctorsDetails.filter(Boolean);

    setState(prev => ({
      ...prev,
      doctors: validDoctors,
      selectedHospital: hospitalData.name,
      loading: false,
      error: null
    }));
  }, [fetchData]);

  const fetchAppointments = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    const data = await axios.get('http://localhost:5000/api/appointment')
    console.log(data.data)

    if (data.data) {
      // console.log("Current User ID:", user?._id);
      const filteredAppointments = data.data.filter(appointment =>
        appointment.patientId === user?._id
      );

      // Format appointments for UI presentation
      const formattedAppointments = filteredAppointments.map(appointment => ({
        id: appointment._id,
        doctor: appointment.doctorName,
        specialty: appointment.specialty || "Doctor",
        date: new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: appointment.time,
        status: appointment.status === "Cancelled" ? "Pending" : "Confirmed"
      }));

      setState(prev => ({
        ...prev,
        appointments: formattedAppointments,
        loading: false,
        error: null
      }));
    }
  }, [fetchData, user]);

  const cancelAppointment = async (appointmentId) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await axios.put(
        `http://localhost:5000/api/appointment/${appointmentId}`,
        { status: "Cancelled" }
      );

      // Update the UI after cancellation
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(apt =>
          apt.id === appointmentId
            ? { ...apt, status: "Pending" }
            : apt
        ),
        loading: false,
        error: null
      }));
    } catch (error) {
      handleError(error, 'Error cancelling appointment');
    }
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/patient/appointment/${doctorId}`);
  };

  useEffect(() => {
    if (user) {
      fetchHospitals();
      fetchAppointments();
    }
  }, [fetchHospitals, fetchAppointments, user]);

  // Helper function to render trend icon
  const renderTrendIcon = (trend) => {
    if (trend === "increasing") return <BarChart className="h-4 w-4 text-green-500" />;
    if (trend === "decreasing") return <BarChart className="h-4 w-4 text-blue-500" />;
    return <BarChart className="h-4 w-4 text-gray-500" />;
  };

  // Handle tabs
  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return renderOverviewContent();
    } else if (activeTab === 'appointments') {
      return renderAppointmentsContent();
    } else if (activeTab === 'hospitals') {
      return renderHospitalsContent();
    } else {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <p>This section is under development.</p>
        </div>
      );
    }
  };

  const renderHospitalsContent = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Hospitals</h2>

        {state.selectedHospital ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Doctors at {state.selectedHospital}</h3>
              <button
                onClick={() => setState(prev => ({
                  ...prev,
                  doctors: [],
                  selectedHospital: null
                }))}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Back to Hospitals
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.doctors.length > 0 ? (
                state.doctors.map((doctor, index) => (
                  <div key={doctor._id || index} className="bg-white border rounded-lg p-4 hover:shadow-md">
                    <h4 className="font-bold">{doctor.name || 'Unknown Doctor'}</h4>
                    <p className="text-gray-600">Specialization: {doctor.specialization?.join(', ') || 'N/A'}</p>
                    <p className="text-gray-600">Experience: {doctor.experience || 'N/A'} years</p>
                    <button
                      onClick={() => handleBookAppointment(doctor._id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Book Appointment
                    </button>
                  </div>
                ))
              ) : (
                <p>No doctors available at this hospital.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.hospitals.length > 0 ? (
              state.hospitals.map((hospital, index) => (
                <div
                  key={hospital._id || index}
                  className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md"
                  onClick={() => fetchDoctors(hospital._id)}
                >
                  <h3 className="font-bold">{hospital.name}</h3>
                  <p>Location: {hospital.location}</p>
                  <p>Rating: {hospital.rating} ⭐</p>
                </div>
              ))
            ) : (
              <p>No hospitals found.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentsContent = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All Appointments</h2>
          <button
            onClick={() => setActiveTab('hospitals')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Book New Appointment
          </button>
        </div>

        {state.loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="divide-y">
            {state.appointments.length > 0 ? (
              state.appointments.map(appointment => (
                <div key={appointment.id} className="py-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{appointment.doctor}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${appointment.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{appointment.specialty}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {appointment.date}
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    {appointment.time}
                  </div>
                  <button
                    onClick={() => cancelAppointment(appointment.id)}
                    className="mt-2 text-red-600 text-sm hover:underline"
                    disabled={appointment.status === 'Pending'}
                  >
                    {appointment.status === 'Pending' ? 'Cancellation Pending' : 'Cancel Appointment'}
                  </button>
                </div>
              ))
            ) : (
              <p className="py-4 text-gray-600">No appointments scheduled. Book your first appointment now!</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderOverviewContent = () => {
    return (
      <>
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Patient'}!</h1>
              {state.appointments.length > 0 ? (
                <p className="mt-1 text-blue-100">
                  Your next appointment is on <strong>{state.appointments[0].date}</strong> with <strong>{state.appointments[0].doctor}</strong>.
                </p>
              ) : (
                <p className="mt-1 text-blue-100">
                  You have no upcoming appointments scheduled.
                </p>
              )}
            </div>
            {state.appointments.length > 0 && (
              <div className="hidden md:block bg-white/10 p-3 rounded-lg text-center">
                <Clock className="h-6 w-6 mx-auto" />
                <p className="text-sm mt-1">{state.appointments[0].time}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('hospitals')}
            className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-blue-50 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="ml-3 font-medium">Book Appointment</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-green-50 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <span className="ml-3 font-medium">Message Doctor</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <button className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-purple-50 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <Pill className="h-5 w-5 text-purple-600" />
              <span className="ml-3 font-medium">Request Refill</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold text-lg text-blue-900">Upcoming Appointments</h2>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </button>
            </div>
            <div className="divide-y">
              {state.loading ? (
                <div className="p-4">Loading appointments...</div>
              ) : state.appointments.length > 0 ? (
                state.appointments.slice(0, 2).map(appointment => (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{appointment.doctor}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${appointment.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{appointment.specialty}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {appointment.date}
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4">
                  <p>No upcoming appointments.</p>
                  <button
                    onClick={() => setActiveTab('hospitals')}
                    className="mt-2 text-blue-600 text-sm hover:underline"
                  >
                    Book your first appointment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold text-lg text-blue-900">Notifications</h2>
              <button className="text-blue-600 text-sm hover:underline">Mark All Read</button>
            </div>
            <div className="divide-y max-h-64 overflow-y-auto">
              {state.notifications.map(notification => (
                <div key={notification.id} className="p-4 hover:bg-gray-50">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      {notification.type === 'appointment' && <Calendar className="h-5 w-5 text-blue-600" />}
                      {notification.type === 'medication' && <Pill className="h-5 w-5 text-purple-600" />}
                      {notification.type === 'message' && <MessageSquare className="h-5 w-5 text-green-600" />}
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Medications Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold text-lg text-blue-900">Medications</h2>
              <button
                onClick={() => setActiveTab('medications')}
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </button>
            </div>
            <div className="divide-y">
              {state.medications.map(medication => (
                <div key={medication.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{medication.name}</h3>
                    <span className={`text-sm ${medication.remaining < 10 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                      {medication.remaining} days left
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{medication.dosage} - {medication.frequency}</p>
                  <div className="mt-2 flex justify-between">
                    <button className="text-sm text-blue-600 hover:underline">Instructions</button>
                    <button className="text-sm text-blue-600 hover:underline">Request Refill</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Metrics Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold text-lg text-blue-900">Health Metrics</h2>
              <button className="text-blue-600 text-sm hover:underline">View Details</button>
            </div>
            <div className="divide-y">
              {state.healthMetrics.map((metric, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{metric.name}</h3>
                    <div className="flex items-center">
                      {renderTrendIcon(metric.trend)}
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-gray-600 text-sm">{metric.value}</p>
                    <p className="text-gray-500 text-xs">{metric.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-bold text-lg text-blue-900">Recent Activity</h2>
              <button className="text-blue-600 text-sm hover:underline">View All</button>
            </div>
            <div className="divide-y">
              {state.recentActivities.map(activity => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{activity.type}</h3>
                    <span className="text-xs text-gray-500">{activity.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-blue-900">MediConnect</span>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search..."
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {state.notifications.length}
              </span>
            </button>
            <button
              onClick={() => navigate('/patient/profile')}
              className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              {user?.name?.charAt(0) || 'P'}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="md:w-64 flex-shrink-0 mb-8 md:mb-0">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-bold text-lg text-blue-900">Patient Portal</h2>
            </div>

            <nav className="p-2">
              <ul className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <Activity className="h-5 w-5" /> },
                  { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
                  { id: 'hospitals', label: 'Hospitals', icon: <FileText className="h-5 w-5" /> },
                  { id: 'medications', label: 'Medications', icon: <Pill className="h-5 w-5" /> },
                  { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
                  { id: 'profile', label: 'My Profile', icon: <User className="h-5 w-5" /> }
                ].map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 mt-4 bg-blue-50 rounded-b-lg">
              <p className="text-sm text-blue-800">Need help?</p>
              <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                Contact Support
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mt-4 p-4">
            <button
              onClick={() => { logout(); navigate('/patient/login'); }}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-8">
          {state.error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
              {state.error}
            </div>
          )}

          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;