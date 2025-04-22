import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import {
    Calendar,
    Clock,
    Heart,
    ArrowLeft,
    User,
    Mail,
    Phone,
    CreditCard,
    Check,
    AlertCircle,
    Clipboard,
    MapPin,
    Stethoscope
} from 'lucide-react';
import { toast } from 'react-toastify';

const AppointmentBooking = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?._id;

    // State management
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Doctor information
    const [doctor, setDoctor] = useState(null);

    // Appointment details
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: '',
        patientName: '',
        patientId: '',
        status: '',
        email: '',
        phone: '',
        doctorId: '',
        doctorName: '',
        hospitalId: '',
        reasonForVisit: '',
        isNewPatient: false,
        insuranceProvider: '',
        specialInstructions: ''
    });

    // Available time slots
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    // Success state
    const [bookingComplete, setBookingComplete] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);

    // Date picker constraints
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30); // Allow booking up to 30 days in advance

    useEffect(() => {
        if (!userId) {
            navigate('patient/login');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [userResponse, doctorResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/patient/profile/${userId}`),
                    axios.get(`http://localhost:5000/api/doctor/profile/${doctorId}`)
                ]);

                const userData = userResponse.data;
                const doctorData = doctorResponse.data;

                setDoctor(doctorData);

                // Pre-populate form with user data
                setFormData(prev => ({
                    ...prev,
                    patientId: userData._id,
                    patientName: userData.name || '',
                    email: userData.email || '',
                    phone: userData.mobile || '',
                    doctorId: doctorData._id,
                    doctorName: doctorData.name,
                    hospitalId: doctorData.hospitalId || ''
                }));

                // Generate time slots for the selected date
                await generateTimeSlots(formData.date);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load doctor information. Please try again.');
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, doctorId, navigate]);

    const fetchDoctorAppointments = async (doctorId, date) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/appointment/doctor/${doctorId}?date=${date}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor appointments:', error);
            return [];
        }
    };

    // Generate time slots based on selected date
    const generateTimeSlots = async (selectedDate) => {
        const isToday = selectedDate === today.toISOString().split('T')[0];
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();

        // Define doctor's working hours (9 AM to 5 PM)
        const startHour = isToday ? Math.max(9, currentHour) : 9;
        const endHour = 17; // 5 PM

        // Get existing appointments for this doctor on the selected date
        const existingAppointments = await fetchDoctorAppointments(doctorId, selectedDate);
        const bookedTimes = existingAppointments.map(apt => apt.time);

        // Generate all possible 15-minute slots
        const slots = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            // Skip generating past time slots if it's today
            const minuteIntervals = [0, 15, 30, 45];

            minuteIntervals.forEach(minute => {
                // Skip times in the past if it's today
                if (isToday && hour === currentHour && minute <= currentMinute) {
                    return;
                }

                // Skip the last slot of the day (5:00 PM)
                if (hour === endHour && minute > 0) {
                    return;
                }

                const formattedHour = hour.toString().padStart(2, '0');
                const formattedMinute = minute.toString().padStart(2, '0');
                const timeString = `${formattedHour}:${formattedMinute}`;

                // Check if this time slot is booked
                const isBooked = bookedTimes.some(bookedTime => {
                    // Convert both times to minutes for easier comparison
                    const bookedParts = bookedTime.split(':');
                    const bookedTotalMinutes = parseInt(bookedParts[0]) * 60 + parseInt(bookedParts[1]);

                    const slotTotalMinutes = hour * 60 + minute;

                    // Consider a slot unavailable if it's within 15 minutes of a booked appointment
                    return Math.abs(bookedTotalMinutes - slotTotalMinutes) < 15;
                });

                slots.push({
                    id: timeString,
                    time: timeString,
                    display: `${hour % 12 || 12}:${formattedMinute} ${hour >= 12 ? 'PM' : 'AM'}`,
                    available: !isBooked
                });
            });
        }

        setAvailableSlots(slots);
        setSelectedTimeSlot(null); // Reset selection when date changes
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setFormData({ ...formData, date: newDate });

        // Set loading state while fetching slots
        setLoading(true);

        // Call the async function and handle the loading state
        generateTimeSlots(newDate).finally(() => {
            setLoading(false);
        });
    };

    const handleTimeSelection = (slot) => {
        if (!slot.available) return;

        setSelectedTimeSlot(slot);
        setFormData({ ...formData, time: slot.time });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('http://localhost:5000/api/patient/create-order', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "300",
        })
        // const response = await fetch("http://localhost:3000/api/patient/getKey");
        // console.log("Received the Keys")
        // if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        // const data = await response.json();

        var options = {
            "key": "rzp_test_BxN4zyfawxKOr3", // Enter the Key ID generated from the Dashboard
            "amount": 300 * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "MediConnect", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": res, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function () {
                await axios.post(
                    'http://localhost:5000/api/appointment',
                    formData,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                await axios.put(
                    `http://localhost:5000/api/patient/profile/${user._id}`,
                    { doctors: [doctorId] },
                    { headers: { 'Content-Type': 'application/json' } }
                )
                setTimeout(() => {
                    toast.success("Payment Successfull !")
                }, 1000)
                navigate('/patient/Dashboard');
            },
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "Sathvik", //your customer's name
                "email": "golisathvik04@gmail.com",
                "contact": "8247757158" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }

        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on('payment.success', function (response) {
            // Process successful payment
            // You can set booking complete here
            setBookingComplete(true);
            setAppointmentDetails({
                confirmationCode: "APT" + Math.random().toString(36).substr(2, 9).toUpperCase(),
                patientName: formData.patientName,
                doctorName: doctor.name,
                date: formData.date,
                time: selectedTimeSlot?.display || formData.time,
                paymentId: response.razorpay_payment_id
            });
        });
    }


    const renderDateSelector = () => {
        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Select Appointment Date</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Choose a date</span>
                    </div>

                    <input
                        type="date"
                        value={formData.date}
                        onChange={handleDateChange}
                        min={today.toISOString().split('T')[0]}
                        max={maxDate.toISOString().split('T')[0]}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />

                    <div className="mt-4 text-sm text-gray-500">
                        <p>• Appointments available up to 30 days in advance</p>
                        <p>• Weekend availability may be limited</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderTimeSelector = () => {
        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Select Appointment Time</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Available time slots</span>
                    </div>

                    {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {availableSlots.map(slot => (
                                <button
                                    key={slot.id}
                                    type="button"
                                    disabled={!slot.available}
                                    onClick={() => handleTimeSelection(slot)}
                                    className={`py-3 px-4 rounded-lg text-center transition-colors ${selectedTimeSlot?.id === slot.id
                                        ? 'bg-blue-600 text-white'
                                        : slot.available
                                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {slot.display}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4 text-gray-500">No available slots for this date</p>
                    )}

                    <div className="mt-4 text-sm text-gray-500 flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-700 mr-2"></div>
                        <span>Available</span>
                        <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300 ml-4 mr-2"></div>
                        <span>Unavailable</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderPatientInformation = () => {
        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="isNewPatient"
                                name="isNewPatient"
                                type="checkbox"
                                checked={formData.isNewPatient}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isNewPatient" className="ml-2 block text-sm text-gray-700">
                                This is my first visit with this doctor
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderVisitDetails = () => {
        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Visit Details</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                            <select
                                name="reasonForVisit"
                                value={formData.reasonForVisit}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select a reason</option>
                                <option value="Regular Checkup">Regular Checkup</option>
                                <option value="New Symptoms">New Symptoms</option>
                                <option value="Follow-up Visit">Follow-up Visit</option>
                                <option value="Chronic Condition">Chronic Condition Management</option>
                                <option value="Prescription Renewal">Prescription Renewal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider (Optional)</label>
                            <input
                                type="text"
                                name="insuranceProvider"
                                value={formData.insuranceProvider}
                                onChange={handleInputChange}
                                placeholder="E.g., Blue Cross, Aetna, Medicare"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions or Notes (Optional)</label>
                            <textarea
                                name="specialInstructions"
                                value={formData.specialInstructions}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Any additional information you'd like the doctor to know"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStepIndicator = () => {
        return (
            <div className="flex justify-between items-center mb-8">
                {['Date & Time', 'Patient Info', 'Visit Details', 'Review'].map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep > index + 1
                            ? 'bg-green-100 text-green-600'
                            : currentStep === index + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}>
                            {currentStep > index + 1 ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </div>
                        <span className={`text-xs mt-1 ${currentStep === index + 1 ? 'font-semibold text-blue-600' : 'text-gray-500'
                            }`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const renderDoctorCard = () => {
        if (!doctor) return null;

        return (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-l-4 border-blue-600">
                <div className="flex items-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <h3 className="font-bold text-lg">{doctor.name || 'Dr. Unknown'}</h3>
                        <p className="text-gray-600">{doctor.specialization?.join(', ') || 'Specialist'}</p>
                        <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">{doctor.location || 'Main Hospital'}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderReview = () => {
        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Review Your Appointment</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium uppercase text-gray-500 mb-2">Appointment Details</h4>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                    <div>
                                        <p className="font-medium">
                                            {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="text-gray-600">
                                            {selectedTimeSlot?.display || formData.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium uppercase text-gray-500 mb-2">Patient</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium">{formData.patientName}</p>
                                    <p className="text-gray-600">{formData.email}</p>
                                    <p className="text-gray-600">{formData.phone}</p>
                                    <p className="text-gray-600 mt-2">
                                        {formData.isNewPatient ? 'New Patient' : 'Returning Patient'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium uppercase text-gray-500 mb-2">Visit Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium">Reason: {formData.reasonForVisit || 'Not specified'}</p>
                                    {doctor && doctor.hospitalName && (
                                        <p className="text-gray-600">Hospital: {doctor.hospitalName}</p>
                                    )}
                                    {formData.insuranceProvider && (
                                        <p className="text-gray-600">Insurance: {formData.insuranceProvider}</p>
                                    )}
                                    {formData.specialInstructions && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">Special Instructions:</p>
                                            <p className="text-gray-600">{formData.specialInstructions}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium uppercase text-gray-500 mb-2">Payment Information</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span>Consultation Fee</span>
                                    <span className="font-medium">₹300.00</span>
                                </div>
                                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center font-medium">
                                    <span>Total</span>
                                    <span>₹300.00</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Payment will be processed securely through Razorpay after confirming your appointment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderConfirmation = () => {
        if (!appointmentDetails) return null;

        return (
            <div className="text-center py-8">
                <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">Appointment Confirmed!</h2>
                <p className="text-gray-600 mb-8">Your appointment has been successfully scheduled.</p>

                <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mb-8 border border-gray-200">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500">Confirmation Code</p>
                            <p className="font-bold text-lg">{appointmentDetails.confirmationCode}</p>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                onClick={() => {/* Copy to clipboard functionality */ }}
                            >
                                <Clipboard className="h-4 w-4 mr-1" />
                                Copy
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Patient</p>
                                <p className="font-medium">{appointmentDetails.patientName}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Stethoscope className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Doctor</p>
                                <p className="font-medium">{appointmentDetails.doctorName}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="font-medium">
                                    {new Date(appointmentDetails.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="text-gray-600">
                                    {appointmentDetails.time}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Payment</p>
                                <p className="font-medium">₹300.00 (Paid)</p>
                                <p className="text-xs text-gray-500">Transaction ID: {appointmentDetails.paymentId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        type="button"
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => {/* Add to calendar functionality */ }}
                    >
                        Add to Calendar
                    </button>
                    <button
                        type="button"
                        className="border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
                        onClick={() => navigate('/patient/dashboard')}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    };

    // Main renderer
    if (loading && !bookingComplete) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading appointment information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (bookingComplete) {
        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <Heart className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-blue-900">MediConnect</span>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    {renderConfirmation()}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Heart className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-blue-900">MediConnect</span>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Book Your Appointment</h1>
                    {renderDoctorCard()}
                    {renderStepIndicator()}

                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <>
                                {renderDateSelector()}
                                {renderTimeSelector()}

                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="text-gray-500 hover:text-gray-700 py-2 px-4"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!selectedTimeSlot}
                                        className={`py-2 px-6 rounded-lg transition-colors ${selectedTimeSlot
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                {renderPatientInformation()}

                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="text-gray-500 hover:text-gray-700 py-2 px-4"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(3)}
                                        disabled={!formData.patientName || !formData.email || !formData.phone}
                                        className={`py-2 px-6 rounded-lg transition-colors ${formData.patientName && formData.email && formData.phone
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                {renderVisitDetails()}

                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        className="text-gray-500 hover:text-gray-700 py-2 px-4"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(4)}
                                        disabled={!formData.reasonForVisit}
                                        className={`py-2 px-6 rounded-lg transition-colors ${formData.reasonForVisit
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {currentStep === 4 && (
                            <>
                                {renderReview()}

                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(3)}
                                        className="text-gray-500 hover:text-gray-700 py-2 px-4"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>Confirm and Pay</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>

                    <div className="mt-12 border-t border-gray-200 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex flex-col items-center">
                                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                                <h3 className="font-medium">24-Hour Cancellation</h3>
                                <p className="text-center text-gray-500">Appointments can be cancelled or rescheduled up to 24 hours in advance.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
                                <h3 className="font-medium">Secure Payments</h3>
                                <p className="text-center text-gray-500">Your payment information is processed securely through Razorpay.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <AlertCircle className="h-6 w-6 text-blue-600 mb-2" />
                                <h3 className="font-medium">Insurance Verification</h3>
                                <p className="text-center text-gray-500">We'll verify your insurance coverage prior to your appointment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;