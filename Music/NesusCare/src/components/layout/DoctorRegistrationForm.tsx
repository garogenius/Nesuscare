import { useState } from 'react';
import { Alert } from './Alert';
import './animations.css'
import logo from './nesuslogo.png'

export function DoctorRegistrationForm() {
  const [doctorData, setDoctorData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    address: '',
    education: [''],
    experience: '',
    hospitals: [''],
    isAvailable: true,
  });

  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // Track current step

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: keyof typeof doctorData, index: number, value: string) => {
    setDoctorData((prevData) => ({
      ...prevData,
      [field]: Array.isArray(prevData[field])
        ? (prevData[field] as string[]).map((item, i) => (i === index ? value : item))
        : [value], // Fallback to an array if undefined or invalid
    }));
  };

  // Handle moving between steps
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step 1: Personal Info
  const step1 = (
    <div>
      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="name"
          className="w-full p-2 border rounded-md"
          value={doctorData.name}
          onChange={handleChange}
        />
      </div>

      {/* Specialization */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Specialization</label>
        <input
          type="text"
          name="specialization"
          className="w-full p-2 border rounded-md"
          value={doctorData.specialization}
          onChange={handleChange}
        />
      </div>

      <div>
      {/* Hospitals */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Hospitals</label>
        <input
          type="text"
          name="hospitals"
          className="w-full p-2 border rounded-md"
          value={doctorData.hospitals.join(', ')}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>

      {/* License Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">License Number</label>
        <input
          type="text"
          name="licenseNumber"
          className="w-full p-2 border rounded-md"
          value={doctorData.licenseNumber}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  // Step 2: Contact Info & Education
  const step2 = (
    <div>
      {/* Phone Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          className="w-full p-2 border rounded-md"
          value={doctorData.phoneNumber}
          onChange={handleChange}
        />
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          className="w-full p-2 border rounded-md"
          value={doctorData.address}
          onChange={handleChange}
        />
      </div>

      {/* Education */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Education</label>
        {doctorData.education.map((_, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-2 border rounded-md mb-2"
            value={doctorData.education[index]}
            onChange={(e) => handleArrayChange('education', index, e.target.value)}
          />
        ))}
      </div>

      {/* Experience */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
        <input
          type="number"
          name="experience"
          className="w-full p-2 border rounded-md"
          value={doctorData.experience}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  // Step 3: Hospitals
  // const step3 = (
  //   <div>
  //     {/* Hospitals */}
  //     <div className="mb-4">
  //       <label className="block text-sm font-medium text-gray-700">Hospitals</label>
  //       <input
  //         type="text"
  //         name="hospitals"
  //         className="w-full p-2 border rounded-md"
  //         value={doctorData.hospitals.join(', ')}
  //         onChange={(e) => handleChange(e)}
  //       />
  //     </div>
  //   </div>
  // );

  // Step 4: Username and Password
  const step3 = (
    <div>
      {/* Username */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          className="w-full p-2 border rounded-md"
          value={doctorData.username}
          onChange={handleChange}
        />
      </div>
      
      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          className="w-full p-2 border rounded-md"
          value={doctorData.password}
          onChange={handleChange}
        />
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className="w-full p-2 border rounded-md"
          value={doctorData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/path-to-your-health-background.jpg')]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">


        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6 animate-fade-in">
          <img src={logo} alt="Nesus Care Logo" className="h-16 md:h-20 mb-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 text-center">Nesus Care</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Doctor Registration</h2>

        {/* Display alert if it's set */}
        {alert && <Alert message={alert.message} type={alert.type} />}

        <form>
          {/* Render steps based on current step */}
          {currentStep === 1 && step1}
          {currentStep === 2 && step2}
          {currentStep === 3 && step3}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <button
                type="button"
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={nextStep}
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Register
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
