import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PVerifyOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const storedOtp = sessionStorage.getItem('otp');
        const email = sessionStorage.getItem('email');

        if (otp === storedOtp) {
            setNotification({ message: '🎉 OTP Verified Successfully!', type: 'success' });
            sessionStorage.removeItem('otp');
            sessionStorage.removeItem('email');
            navigate('/patient/Dashboard');
        } else {
            setNotification({ message: '⚠️ Invalid OTP. Please try again.', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
                        <p className="mt-2 text-gray-600">Enter the OTP sent to your email</p>
                    </div>

                    {notification.message && (
                        <div className={`mb-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {notification.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full h-12 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Verify OTP
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PVerifyOtp;
