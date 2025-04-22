import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Activity, User, Users, Bell, Settings, Clock, CheckCircle, X, ArrowRight, MessageSquare, Clipboard, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Mail, Phone, PlusCircle, Search, MoreVertical, FileText as FileTextIcon, Building, MapPin, LogOut } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const [hospitals, setHospitals] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    availability: 'full-time',
    startDate: '',
    isLoading: false,
    error: null
  });
  let [coverLetter, setCoverLetter] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicationForm, setMedicationForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    duration: '',  // Adding duration field
    isLoading: false,
    error: null
  });
  const [medicationSuggestions, setMedicationSuggestions] = useState([
    { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Every night', duration: '30 days' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
    { name: 'Ibuprofen', dosage: '400mg', frequency: 'Three times daily', duration: '5 days' }
  ]);
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patientsdata, setPatients] = useState([]);
  const [doctorMessages, setDoctorMessages] = useState([]);
  const [replyBoxVisible, setReplyBoxVisible] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { user, logout } = useAuth();
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient/profile`);
        // Filter based on currentDoctorId
        // console.log(response.data)
        const filteredPatients = response.data.filter(
          patient => patient.doctors.includes(user?._id)
        );
        setPatients(filteredPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointment');
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
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages`);
        setDoctorMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [user._id]);

  // Add this to your useEffect blocks or create a new one
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('http://localhost:5000/api/hospitals');
        setHospitals(response.data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    if (activeTab === 'hospitals') {
      fetchHospitals();
    }
  }, [activeTab]);


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

  const selectMedicationSuggestion = (suggestion) => {
    setMedicationForm(prev => ({
      ...prev,
      name: suggestion.name,
      dosage: suggestion.dosage,
      frequency: suggestion.frequency,
      duration: suggestion.duration,
    }));
  };

  const fetchPatientPrescriptions = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/prescriptions/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient prescriptions:', error);
      return [];
    }
  };

  const handleApplyToHospital = (hospital) => {
    setSelectedHospital(hospital);
    setShowApplicationModal(true);
  };

  const handleViewProfile = async (patientId) => {
    try {
      // First get medical record
      const recordResponse = await axios.get(`http://localhost:5000/api/patient/profile/downloadrecord/${patientId}`);
      const fileUrl = recordResponse.data.fileUrl;

      // Also fetch prescriptions for this patient
      const prescriptions = await fetchPatientPrescriptions(patientId);

      // Set selected patient with prescriptions
      const patient = patientsdata.find(p => p._id === patientId);
      setSelectedPatient({
        id: patientId,
        name: patient?.name || 'Patient',
        prescriptions: prescriptions
      });

      // Open medical record in new tab
      window.open(fileUrl, '_blank');
    } catch (err) {
      console.error('Failed to fetch record:', err);
      toast.warning('Unable to open medical record.');
    }
  };

  const handleMedicationChange = (e) => {
    const { name, value } = e.target;
    setMedicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrescribeMedication = (patientId, patientName) => {
    // Set the selected patient and show the modal
    setSelectedPatient({
      id: patientId,
      name: patientName
    });
    setShowMedicationModal(true);
  };

  const handleMedicationSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const HospitalApplicationModal = () => {
    if (!showApplicationModal) return null;

    const handleApplicationChange = (e) => {
      const { name, value } = e.target;
      setApplicationForm(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleApplicationSubmit = async (e) => {
      e.preventDefault();
      setApplicationForm(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        await axios.post(`http://localhost:5000/api/hospitals/apply`, {
          doctorId: user._id,
          hospitalId: selectedHospital._id,
          coverLetter: applicationForm.coverLetter,
          availability: applicationForm.availability,
          startDate: applicationForm.startDate,
          status: 'pending', // Initial status
          appliedAt: new Date(),
          // doctorName: user.name,
          // specialization: user.specialization,
          // email: user.email
        });

        // Reset form and close modal
        setApplicationForm({
          coverLetter: '',
          availability: 'full-time',
          startDate: '',
          isLoading: false,
          error: null
        });
        setShowApplicationModal(false);
        setSelectedHospital(null);

        // Show success message
        toast.success(`Application submitted to ${selectedHospital.name} successfully!`);
      } catch (error) {
        console.error('Failed to submit application:', error);
        setApplicationForm(prev => ({
          ...prev,
          isLoading: false,
          error: error.response?.data?.message || 'Failed to submit application'
        }));
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-900">
              Apply to {selectedHospital?.name}
            </h3>
            <button
              onClick={() => setShowApplicationModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {applicationForm.error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {applicationForm.error}
            </div>
          )}

          <form onSubmit={handleApplicationSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter/Introduction
                </label>
                <textarea
                  name="coverLetter"
                  required
                  className="w-full p-2 border rounded-md"
                  rows="5"
                  placeholder="Briefly introduce yourself and explain why you'd like to join this hospital..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  className="w-full p-2 border rounded-md"
                  value={applicationForm.availability}
                  onChange={handleApplicationChange}
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="weekends-only">Weekends Only</option>
                  <option value="evenings">Evenings</option>
                  <option value="on-call">On-call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="w-full p-2 border rounded-md"
                  value={applicationForm.startDate}
                  onChange={handleApplicationChange}
                  required
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  Your professional information and credentials will be automatically shared with this hospital.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowApplicationModal(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
                disabled={applicationForm.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${applicationForm.isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={applicationForm.isLoading}
              >
                {applicationForm.isLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const confirmAndSubmitPrescription = async () => {
    setMedicationForm(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await axios.post('http://localhost:5000/api/prescriptions', {
        patientId: selectedPatient.id,
        doctorId: user._id,
        medication: medicationForm.name,
        dosage: medicationForm.dosage,
        frequency: medicationForm.frequency,
        duration: medicationForm.duration,
        instructions: medicationForm.instructions,
        datePrescribed: new Date()
      });

      // Reset all states
      setMedicationForm({
        name: '',
        dosage: '',
        frequency: '',
        instructions: '',
        duration: '',
        isLoading: false,
        error: null
      });
      setShowConfirmation(false);
      setShowMedicationModal(false);
      setSelectedPatient(null);

      // Show success message
      toast.success(`Medication prescribed to ${selectedPatient.name} successfully!`);
    } catch (error) {
      console.error('Failed to prescribe medication:', error);
      setMedicationForm(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to prescribe medication'
      }));
      toast.error('Failed to prescribe medication. Please try again.');
    }
  };

  const renderHospitalsContent = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-blue-900">Available Hospitals</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search hospitals..."
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <div key={hospital._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300">
                <div className="h-40 bg-blue-100 flex items-center justify-center">
                  {hospital.image ? (
                    <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building className="h-16 w-16 text-blue-300" />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">{hospital.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{hospital.location}</p>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{hospital.doctorsCount || 'N/A'} doctors</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <p className="text-sm text-gray-600">{hospital.address || 'Address not available'}</p>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <p className="text-sm text-gray-600">{hospital.phone || 'Contact not available'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyToHospital(hospital)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Apply to Join
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Building className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hospitals found. Check back later.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

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
    } else if (activeTab === 'hospitals') {
      return renderHospitalsContent();
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
    return (
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-900">Today's Summary</h2>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  {/* Logout button */}
                  <button
                    onClick={logout}
                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Appointments', value: appointments.length, icon: <Calendar className="h-6 w-6 text-blue-600" />, color: 'bg-blue-50' },
                  // { label: 'Pending Reports', value: '3', icon: <FileText className="h-6 w-6 text-amber-600" />, color: 'bg-amber-50' },
                  { label: 'Messages', value: doctorMessages.length, icon: <MessageSquare className="h-6 w-6 text-green-600" />, color: 'bg-green-50' }
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
                <button className="text-blue-600 font-medium flex items-center" onClick={() => setActiveTab('appointments')}>
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>

              <div className="space-y-4">
                {appointments.slice(0, 5).map(appointment => (
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
          </div>

          <div className="space-y-6">
            {/* Dedicated Logout Section */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-800">Account Options</h2>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
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

            {/* <div className="bg-white rounded-xl shadow p-6">
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
            </div> */}

          </div>
        </div>
      </main>
    );
  };

  const renderAppointmentsContent = () => {
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
      try {
        // Update status in your database/API
        // console.log(appointmentId)
        await fetch(`http://localhost:5000/api/appointment/${appointmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus
          }),
        });

        if (newStatus === 'Completed') {
          const appointment = appointments.find(appointment => appointment._id === appointmentId)
          const patient = await axios.get(`http://localhost:5000/api/patient/profile/${appointment.patientId}`)
          await axios.put(`http://localhost:5000/api/patient/profile/${appointment.patientId}`, {
            doctors: [...new Set([...patient.data.doctors, appointment.doctorId])],
          }
          )
          const doctor = await axios.get(`http://localhost:5000/api/doctor/profile/${appointment.doctorId}`)
          await axios.put(`http://localhost:5000/api/doctor/profile/${appointment.doctorId}`, {
            patients: [...new Set([...doctor.data.patients, appointment.patientId])],
          }
          )
          const hospital = await axios.get(`http://localhost:5000/api/hospitals/${doctor.data.hospitals}`)
          await axios.put(`http://localhost:5000/api/hospitals/${doctor.data.hospitals}`, {
            patients: [...new Set([...hospital.data.patients, appointment.patientId])],
          }
          )
        }

        // Update local state to reflect changes immediately
        const updatedAppointments = appointments.map(appointment =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        );

        // Assuming you have a setAppointments function
        setAppointments(updatedAppointments);
      } catch (error) {
        console.error('Failed to update appointment status:', error);
        // Handle error - show notification or message to user
      }
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-blue-900">My Appointments</h2>
          {/* Optional button */}
          <button
            onClick={() => setActiveTab('patients')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Patients
          </button>
        </div>

        {state.loading ? (
          <p>Loading appointments...</p>
        ) : (
          <div className="divide-y">
            {appointments.length > 0 ? (
              [...appointments]
                .sort((a, b) => {
                  const dateTimeA = new Date(`${a.date} ${a.time}`)
                  const dateTimeB = new Date(`${b.date} ${b.time}`)
                  return dateTimeA - dateTimeB
                })
                .map(appointment => (
                  <div key={appointment.id} className="py-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{appointment.patientName || 'Unknown Patient'}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${appointment.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm">
                      Reason: {appointment.reasonForVisit || 'N/A'}
                    </p>

                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {appointment.date}
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      {appointment.time}
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      Email: {appointment.patientEmail}
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'Completed')}
                        className={`px-3 py-1 text-xs rounded ${appointment.status === 'Completed'
                          ? 'bg-green-200 text-green-800 cursor-default'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        disabled={appointment.status === 'Completed'}
                      >
                        {appointment.status === 'Completed' ? 'Completed' : 'Mark Completed'}
                      </button>

                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'Rejected')}
                        className={`px-3 py-1 text-xs rounded ${appointment.status === 'Rejected'
                          ? 'bg-red-200 text-red-800 cursor-default'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        disabled={appointment.status === 'Rejected'}
                      >
                        {appointment.status === 'Rejected' ? 'Rejected' : 'Reject'}
                      </button>
                    </div>

                    {/* Optional feature: reschedule/cancel */}
                    {/* <button className="mt-2 text-blue-600 hover:underline text-sm">Reschedule</button> */}
                  </div>
                ))
            ) : (
              <p className="py-4 text-gray-600">No appointments scheduled yet.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPatientsContent = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Patients</h2>

        {state.loading ? (
          <p className="text-gray-600">Loading patient information...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patientsdata && patientsdata.length > 0 ? (
              patientsdata.map((patient, index) => (
                <div
                  key={patient._id || index}
                  className="border rounded-lg p-4 hover:shadow-md bg-gray-50 transition duration-300"
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {patient.name?.[0] || 'P'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{patient.name || "Unknown"}</h3>
                      <p className="text-sm text-gray-600">{patient.email || "No email"}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Age:</strong> {patient.age || "N/A"}</p>
                    <p><strong>Gender:</strong> {patient.gender || "N/A"}</p>
                    <p><strong>Phone:</strong> {patient.phone || "N/A"}</p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleViewProfile(patient._id)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center justify-center"
                    >
                      <FileText className="h-4 w-4 mr-1" /> View Profile
                    </button>
                    <button
                      onClick={() => handlePrescribeMedication(patient._id, patient.name)}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center justify-center"
                    >
                      <Clipboard className="h-4 w-4 mr-1" /> Prescribe
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No patients found.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderScheduleContent = () => {
    return (<>Schedules</>
      // Your appointments content here
    );
  };
  const renderMessagesContent = () => {
    const handleReplySubmit = async (messageId) => {
      try {
        await axios.put(`http://localhost:5000/api/messages/${messageId}`, {
          reply: replyText
        });
        const res = await axios.get(`http://localhost:5000/api/messages`);
        // const filteredMessages = res.filter(message => message.doctorId === user._id)
        setDoctorMessages(res.data);
        setReplyBoxVisible(null);
        setReplyText('');
      } catch (error) {
        console.error("Error sending reply:", error);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Patient Messages</h2>
        <p className="text-gray-600 text-sm mb-4">
          This section previews messages sent by patients to the doctor. You can view and respond to their queries.
        </p>

        {doctorMessages.length === 0 ? (
          <p className="text-gray-600">No messages received yet.</p>
        ) : (
          doctorMessages.map((msg, index) => (
            <div key={msg._id || index} className="border p-4 mb-4 rounded-md bg-blue-50">
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold text-blue-800">From: Patient {msg.patientName}</h4>
                <span className="text-sm text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-gray-700 mb-2">Message: {msg.message}</p>

              {msg.reply ? (
                <div className="mt-2 text-green-700 bg-green-50 border-l-4 border-green-500 p-2 rounded">
                  <strong>Replied:</strong> {msg.reply}
                </div>
              ) : (
                <>
                  {replyBoxVisible === msg._id ? (
                    <div className="mt-3">
                      <textarea
                        className="w-full p-2 border rounded-md mb-2"
                        rows="3"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReplySubmit(msg._id)}
                          className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyBoxVisible(null);
                            setReplyText('');
                          }}
                          className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyBoxVisible(msg._id)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Reply
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
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
      const hasAppointment = [4, 10, 15, 22].includes(i);

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

  // Add the medication modal
  // Modify the MedicationModal function
  const MedicationModal = () => {
    if (!showMedicationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-900">
              Prescribe Medication for {selectedPatient?.name}
            </h3>
            <button
              onClick={() => setShowMedicationModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {medicationForm.error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {medicationForm.error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select:
            </label>
            <div className="flex flex-wrap gap-2">
              {medicationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectMedicationSuggestion(suggestion)}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                >
                  {suggestion.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleMedicationSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-2 border rounded-md"
                  value={medicationForm.name}
                  onChange={handleMedicationChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    required
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., 10mg"
                    value={medicationForm.dosage}
                    onChange={handleMedicationChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., 7 days"
                    value={medicationForm.duration}
                    onChange={handleMedicationChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  name="frequency"
                  className="w-full p-2 border rounded-md"
                  value={medicationForm.frequency}
                  onChange={handleMedicationChange}
                  required
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every morning">Every morning</option>
                  <option value="Every night">Every night</option>
                  <option value="As needed">As needed</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  name="instructions"
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  placeholder="Any special instructions for the patient"
                  value={medicationForm.instructions}
                  onChange={handleMedicationChange}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowMedicationModal(false);
                  setMedicationForm({
                    name: '',
                    dosage: '',
                    frequency: '',
                    instructions: '',
                    duration: '',
                    isLoading: false,
                    error: null
                  });
                }}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
                disabled={medicationForm.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${medicationForm.isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                disabled={medicationForm.isLoading}
              >
                {medicationForm.isLoading ? (
                  <>
                    <span className="mr-2">Processing...</span>
                    {/* Add a spinner icon here if desired */}
                  </>
                ) : (
                  'Prescribe Medication'
                )}
              </button>
            </div>
          </form>
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Confirm Prescription
                </h3>

                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <p><strong>Patient:</strong> {selectedPatient?.name}</p>
                  <p><strong>Medication:</strong> {medicationForm.name} {medicationForm.dosage}</p>
                  <p><strong>Frequency:</strong> {medicationForm.frequency}</p>
                  {medicationForm.duration && <p><strong>Duration:</strong> {medicationForm.duration}</p>}
                  {medicationForm.instructions && <p><strong>Instructions:</strong> {medicationForm.instructions}</p>}
                </div>

                <p className="text-gray-600 mb-4">
                  Please confirm you want to prescribe this medication to the patient.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={confirmAndSubmitPrescription}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={medicationForm.isLoading}
                  >
                    {medicationForm.isLoading ? 'Processing...' : 'Confirm & Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
                { id: 'hospitals', label: 'Hospitals', icon: <Building className="h-5 w-5" /> },
                { id: 'appointments', label: 'Appointments', icon: <Calendar className="h-5 w-5" /> },
                { id: 'patients', label: 'Patients', icon: <User className="h-5 w-5" /> },
                // { id: 'schedule', label: 'Schedule', icon: <Clock className="h-5 w-5" /> },
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
              <p className="text-gray-500">Welcome back , Dr.{user.name}</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* <div className="relative">
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
              </div> */}

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2">
                  DS
                </div>
                <span className="font-medium text-gray-700">Dr.{user.name}</span>
              </div>

              {/* <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                <Settings className="h-5 w-5" />
              </button> */}
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
          {/* Render the medication modal */}
          {renderTabContent()}
        </main>
      </div>
      <MedicationModal />
      <HospitalApplicationModal />
    </div>
  );
};

export default DoctorDashboard;