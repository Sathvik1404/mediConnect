import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Activity, User, Users, Bell, Settings, Clock, CheckCircle, X, ArrowRight, MessageSquare, Clipboard, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Mail, Phone, PlusCircle, Search, MoreVertical, FileText as FileTextIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const DoctorDashboard = () => {
  const [state, setState] = useState({
    patients: [],
    appointments: [],
    recentActivities: [],
    notifications: [],
    loading: false,
    error: null
    // Add other properties you need for your doctor dashboard
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [upcomingAppointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const { user, logout } = useAuth();
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient/profile`);
        // Filter based on currentDoctorId
        const filtered = response.data.filter(patient => patient === user._id);
        console.log(response)
        setPatients(filtered);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        // setLoading(false);
      }
    };


    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointment');
        // console.log(response.data)
        // console.log(user)
        const filteredAppointments = response.data.filter(
          appointment => appointment.doctorId === user._id || null
        );
        setAppointments(filteredAppointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchAppointments();
    fetchPatients();
  }, []);

  const recentPatients = [
    { id: 1, name: 'Sarah Johnson', lastVisit: '2 days ago', condition: 'Hypertension', avatar: 'SJ' },
    { id: 2, name: 'Michael Chen', lastVisit: '1 week ago', condition: 'Diabetes', avatar: 'MC' },
    { id: 3, name: 'Emily Rodriguez', lastVisit: '2 weeks ago', condition: 'Asthma', avatar: 'ER' },
  ];

  const notifications = [
    { id: 1, type: 'appointment', message: 'New appointment request from David Miller', time: '10 mins ago' },
    { id: 2, type: 'message', message: 'Sarah Johnson sent you a message', time: '1 hour ago' },
    { id: 3, type: 'lab', message: 'Lab results for Michael Chen are ready', time: '3 hours ago' },
  ];

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return renderOverviewContent();
    } else if (activeTab === 'appointments') {
      return renderAppointmentsContent();
    } else if (activeTab === 'patients') {
      return renderPatientsContent();
    } else if (activeTab === 'schedule') {
      return renderScheduleContent();
    } else if (activeTab === 'messages') {
      return renderMessagesContent();
    } else {
      // Default fallback for sections under development
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <p>This section is under development.</p>
        </div>
      );
    }
  };

  const renderOverviewContent = () => {
    return (<>Overview</>
      // Your overview content here
      // Copy structure from patient dashboard and modify as needed
    )
  };

  const renderAppointmentsContent = () => {
    return (<>Appointments</>
      // Your appointments content here
    );
  };
  const renderPatientsContent = () => {
    return (<>Patients</>
      // Your appointments content here
    );
  };
  const renderScheduleContent = () => {
    return (<>Schedules</>
      // Your appointments content here
    );
  };
  const renderMessagesContent = () => {
    return (<>Messages</>
      // Your appointments content here
    );
  };

  // Helper function to generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const date = new Date(selectedDate);
    date.setDate(1);

    // Find the first day of the month
    const firstDayIndex = date.getDay();

    // Add empty days for the start of the month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-start-${i}`} className="h-8 w-8"></div>);
    }

    // Get the last day of the month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Generate calendar days
    for (let i = 1; i <= lastDay; i++) {
      const isToday = i === new Date().getDate() && date.getMonth() === new Date().getMonth();
      const hasAppointment = [4, 10, 15, 22].includes(i); // Mock data for days with appointments

      days.push(
        <div
          key={`day-${i}`}
          className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer text-sm
            ${isToday ? 'bg-blue-600 text-white' : ''}
            ${hasAppointment && !isToday ? 'border-2 border-blue-600 text-blue-600' : ''}
            ${!isToday && !hasAppointment ? 'hover:bg-blue-50' : ''}
          `}
        >
          {i}
        </div>
      );
    }

    return days;
  };
  const handleCalenderLeft = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  }
  const handleCalenderRight = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b flex items-center">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">MC</span>
          </div>
          {sidebarOpen && (
            <span className="ml-3 font-bold text-blue-900">MediConnect</span>
          )}
        </div>

        <div className="flex-grow py-8">
          <nav className="p-2">
            <ul className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: <Activity className="h-5 w-5" /> },
                { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
                { id: 'patients', label: 'Patients', icon: <User className="h-5 w-5" /> },
                { id: 'schedule', label: 'Schedule', icon: <Clock className="h-5 w-5" /> },
                { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
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
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Doctor Dashboard</h1>
              <p className="text-gray-500">Welcome back, Dr. Smith</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2">
                  DS
                </div>
                <span className="font-medium text-gray-700">Dr. Smith</span>
              </div>

              <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        {/* <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Today's Summary</h2>
                  <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Appointments', value: upcomingAppointments.length, icon: <Calendar className="h-6 w-6 text-blue-600" />, color: 'bg-blue-50' },
                    { label: 'Pending Reports', value: '3', icon: <FileText className="h-6 w-6 text-amber-600" />, color: 'bg-amber-50' },
                    { label: 'Messages', value: '12', icon: <MessageSquare className="h-6 w-6 text-green-600" />, color: 'bg-green-50' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-4 rounded-lg border">
                      <div className={`h-12 w-12 rounded-full ${item.color} flex items-center justify-center mr-4`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-gray-500">{item.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Upcoming Appointments</h2>
                  <button className="text-blue-600 font-medium flex items-center">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {appointment.avatar}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-800">{appointment.patientName}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.time} • {appointment.type}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                          {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>

                        <div className="flex ml-4">
                          <button className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">
                            <FileTextIcon className="h-4 w-4" />
                          </button>
                          <button className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 ml-2">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Patient Details</h2>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">Edit</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View Full Record</button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mb-4">
                      SJ
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Sarah Johnson</h3>
                    <p className="text-gray-500">34 years, Female</p>

                    <div className="mt-4 space-y-2 w-full max-w-xs">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>sarah.j@example.com</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                    </div>

                    <button className="mt-6 w-full max-w-xs px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                      Send Message
                    </button>
                  </div>

                  <div className="md:w-2/3 md:pl-6 md:border-l">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Medical History</h4>
                        <div className="space-y-2">
                          {[
                            { condition: 'Hypertension', since: '2018', status: 'Ongoing' },
                            { condition: 'Migraine', since: '2015', status: 'Managed' }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                              <span>{item.condition}</span>
                              <span className="text-gray-500">Since {item.since} • {item.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Current Medications</h4>
                        <div className="space-y-2">
                          {[
                            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
                            { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed' }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                              <span>{item.name} {item.dosage}</span>
                              <span className="text-gray-500">{item.frequency}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Recent Visits</h4>
                        <div className="space-y-2">
                          {[
                            { date: 'Mar 15, 2025', reason: 'Blood pressure check', doctor: 'Dr. Smith' },
                            { date: 'Feb 02, 2025', reason: 'Migraine follow-up', doctor: 'Dr. Smith' }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                              <span>{item.date}</span>
                              <span className="text-gray-500">{item.reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Calendar</h2>
                  <div className="flex space-x-2">
                    <button onClick={handleCalenderLeft} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={handleCalenderRight} className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h3 className="font-medium text-gray-800">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2 text-sm text-gray-500">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center font-medium">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays()}
                </div>

                <div className="mt-6">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Appointment
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Recent Patients</h2>
                  <button className="text-blue-600 font-medium flex items-center">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <div className="space-y-4">
                  {recentPatients.map(patient => (
                    <div key={patient.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                        {patient.avatar}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.condition}</p>
                      </div>
                      <div className="text-sm text-gray-500">{patient.lastVisit}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="w-full p-2 pl-10 border rounded-lg text-sm"
                  />
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-blue-900">Notifications</h2>
                  <button className="text-blue-600 font-medium text-sm">Mark all as read</button>
                </div>

                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className="p-3 border-l-4 border-blue-600 bg-blue-50 rounded-r-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-gray-800">{notification.message}</p>
                        <button className="text-gray-400 hover:text-gray-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main> */}
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

export default DoctorDashboard;