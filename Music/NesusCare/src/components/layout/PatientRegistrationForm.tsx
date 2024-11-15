import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert } from './Alert';
import logo from './nesuslogo.png'; // Import the logo
import './animations.css';
import { div } from 'framer-motion/client';


export function PatientRegistrationForm() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.confirmPassword) {
      setAlert({ message: 'Please fill in all fields.', type: 'error' });
      return false;
    }

    if (userData.password !== userData.confirmPassword) {
      setAlert({ message: "Passwords don't match!", type: 'error' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:3000/auth/register', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: 'patient',
      });
      setAlert({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      setAlert({
        message: error.response?.data?.message || 'Registration failed!',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4 overflow-hidden">
  {/* Background Logo Animation */}
  <div
    className="absolute top-0 left-0 w-full h-full opacity-30 bg-no-repeat bg-contain animate-moveAround"
    style={{
      backgroundImage: `url(${logo})`,
      backgroundPosition: 'center',
      backgroundSize: 'auto', // Maintain original aspect ratio
      width: '500px',  // Adjust the width as needed
      height: '500px', // Adjust the height as needed
      transform: 'translate(-80%, -80%)', // Keep it centered
    }}
  ></div>
  {/* Rest of the form components */}





      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl relative z-10">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6 animate-fade-in">
          <img src={logo} alt="Nesus Care Logo" className="h-16 md:h-20 mb-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 text-center">Nesus Care</h1>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 text-center">Patient Registration</h2>
        {alert && <Alert message={alert.message} type={alert.type} />}
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={userData.firstName}
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={userData.lastName}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={userData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={userData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={userData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
    
  );
}
