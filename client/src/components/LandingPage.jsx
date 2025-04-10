import React, { useState, useEffect } from 'react';
import { Heart, Calendar, FileText, Activity, User, UserPlus, Clock, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleButton = (e) => {
        e.preventDefault()
        navigate('/authpage')
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Navigation */}
            <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Heart className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold text-blue-900">MediConnect</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
                        <a href="#for-patients" className="text-gray-700 hover:text-blue-600 transition-colors">For Patients</a>
                        <a href="#for-doctors" className="text-gray-700 hover:text-blue-600 transition-colors">For Doctors</a>
                        <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonials</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleButton} className="hidden md:inline-flex px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">Log In</button>
                        <button onClick={handleButton} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Sign Up</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 md:px-0">
                <div className="container mx-auto flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
                            Healthcare Management <span className="text-blue-600">Simplified</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 md:text-xl">
                            Connect patients, doctors, and hospitals on one seamless platform. Book appointments, share medical records, and communicate with ease.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button onClick={handleButton} className="py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-xl transition-colors">
                                Get Started
                            </button>
                            <a href='#testimonials'><button className="py-4 px-6 border border-blue-600 text-blue-600 text-lg font-medium rounded-xl hover:bg-blue-50 transition-colors">
                                Learn More
                            </button></a>
                        </div>
                        <div className="mt-8 flex items-center space-x-2">
                            <div className="flex -space-x-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-blue-${300 + i * 100}`}></div>
                                ))}
                            </div>
                            <p className="text-gray-600 font-medium">
                                <span className="text-blue-600 font-bold">1000+</span> healthcare providers trust us
                            </p>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        <div className="relative z-0 rounded-xl overflow-hidden shadow-2xl">
                            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 aspect-video rounded-xl"></div>
                            <img
                                src="/dashboard.png"
                                alt="Hospital management dashboard preview"
                                className="absolute inset-0 w-full h-full object-cover rounded-xl"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <p className="font-medium">Easy appointment booking</p>
                            </div>
                        </div>
                        <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-blue-500" />
                                <p className="font-medium">Secure medical records</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                            All-in-One Healthcare Platform
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive system streamlines the healthcare experience for patients, doctors, and hospital staff.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Calendar className="h-10 w-10 text-blue-600" />,
                                title: "Smart Scheduling",
                                description: "Book appointments with real-time availability. Receive reminders and manage your calendar with ease."
                            },
                            {
                                icon: <FileText className="h-10 w-10 text-blue-600" />,
                                title: "Digital Records",
                                description: "Access and share medical records securely. Track your health history in one centralized location."
                            },
                            {
                                icon: <Activity className="h-10 w-10 text-blue-600" />,
                                title: "Health Monitoring",
                                description: "Monitor vital statistics and health metrics. Receive personalized insights and recommendations."
                            },
                            {
                                icon: <User className="h-10 w-10 text-blue-600" />,
                                title: "Personal Dashboards",
                                description: "Customized interfaces for patients, doctors, and hospitals. See only what's relevant to you."
                            },
                            {
                                icon: <Clock className="h-10 w-10 text-blue-600" />,
                                title: "24/7 Accessibility",
                                description: "Access your healthcare information anytime, anywhere. Never be without your critical health data."
                            },
                            {
                                icon: <Shield className="h-10 w-10 text-blue-600" />,
                                title: "Secure & Private",
                                description: "Bank-level security for your sensitive medical information. Your privacy is our priority."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                                <div className="rounded-full bg-blue-50 w-16 h-16 flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-blue-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Patients Section */}
            <section id="for-patients" className="py-20 bg-blue-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <div className="relative">
                                <div className="rounded-xl overflow-hidden shadow-xl">
                                    <img
                                        src="/booking.png"
                                        alt="Patient using app"
                                        className="w-full object-cover rounded-xl"
                                    />
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Next Appointment</p>
                                            <p className="font-medium">Dr. Smith, Tue 3:30 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 md:pl-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                                For Patients
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Take control of your healthcare journey with our patient-focused features.
                            </p>
                            <div className="mt-8 space-y-6">
                                {[
                                    "Book appointments with preferred doctors",
                                    "Access your complete medical history",
                                    "Receive medication reminders",
                                    "Communicate directly with your healthcare providers",
                                    "Get lab results and diagnoses in real-time"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="ml-3 text-gray-600">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-8 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                Create Patient Account
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Doctors Section */}
            <section id="for-doctors" className="py-20 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row-reverse items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <div className="relative">
                                <div className="rounded-xl overflow-hidden shadow-xl">
                                    <img
                                        src="/doctor"
                                        alt="Doctor using app"
                                        className="w-full object-cover rounded-xl"
                                    />
                                </div>
                                <div className="absolute -top-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <UserPlus className="h-6 w-6 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Today's Patients</p>
                                            <p className="font-medium">12 Scheduled</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 md:pr-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                                For Doctors
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Streamline your practice and focus more on patient care with our doctor tools.
                            </p>
                            <div className="mt-8 space-y-6">
                                {[
                                    "Manage your appointment schedule efficiently",
                                    "Access complete patient medical records instantly",
                                    "Document diagnoses and treatments digitally",
                                    "Communicate securely with patients and colleagues",
                                    "Manage prescriptions and referrals electronically"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <p className="ml-3 text-gray-600">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleButton} className="mt-8 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                                Join as Healthcare Provider
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                            What Our Users Say
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            Join thousands of satisfied patients and healthcare providers already using our platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "The appointment system is so intuitive. I've never missed a doctor's appointment since I started using this platform.",
                                name: "Sarah Johnson",
                                role: "Patient"
                            },
                            {
                                quote: "As a doctor, this system has revolutionized how I manage my practice. Less paperwork means more time with patients.",
                                name: "Dr. Michael Chen",
                                role: "Cardiologist"
                            },
                            {
                                quote: "Our hospital has seen a 40% reduction in administrative costs since implementing this system. It's been transformative.",
                                name: "Emily Rodriguez",
                                role: "Hospital Administrator"
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                                <div className="mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-medium text-blue-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Ready to Transform Your Healthcare Experience?
                    </h2>
                    <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
                        Join our growing community of patients, doctors, and hospitals. Experience healthcare management like never before.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button onClick={handleButton} className="py-4 px-6 bg-white text-blue-600 hover:bg-blue-50 font-medium text-lg rounded-xl transition-colors">
                            Sign Up Now
                        </button>
                        <button onClick={handleButton} className="py-4 px-6 border border-white text-white hover:bg-blue-700 font-medium text-lg rounded-xl transition-colors">
                            Schedule a Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-900 text-white py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <Heart className="h-6 w-6 text-blue-400" />
                                <span className="ml-2 text-lg font-bold">MediConnect</span>
                            </div>
                            <p className="text-blue-200">
                                Transforming healthcare management for patients, doctors, and hospitals.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Platform</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">For Patients</a></li>
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">For Doctors</a></li>
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">For Hospitals</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">HIPAA Compliance</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-blue-800 text-center text-blue-300">
                        <p>© {new Date().getFullYear()} MediConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;