import { useState } from 'react';
import logo from './nesuslogo.png'

interface CoordinatesDto {
  latitude: string;
  longitude: string;
}

interface HospitalData {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  healthcareType: string;
  coordinates: CoordinatesDto;
  googleMapUrl: string;
  specialties: string[];
  emergencyServices: boolean;
  operatingHours: string;
  hospitalId: string;
  password: string;
  confirmPassword: string;
}

export function HospitalRegistrationForm() {
  const [hospitalData, setHospitalData] = useState<HospitalData>({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    website: '',
    healthcareType: '',
    coordinates: {
      latitude: '',
      longitude: '',
    },
    googleMapUrl: '',
    specialties: [''],
    emergencyServices: false,
    operatingHours: '',
    hospitalId: '',
    password: '',
    confirmPassword: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Ensure this matches the number of steps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHospitalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNestedChange = (section: 'coordinates', field: string, value: string) => {
    setHospitalData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (index: number, value: string) => {
    setHospitalData((prevData) => ({
      ...prevData,
      specialties: prevData.specialties.map((item, i) => (i === index ? value : item)),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step 1: Basic Info
  const step1 = (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
        <input
          type="text"
          name="name"
          className="w-full p-2 border rounded-md"
          value={hospitalData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          className="w-full p-2 border rounded-md"
          value={hospitalData.address}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          className="w-full p-2 border rounded-md"
          value={hospitalData.phoneNumber}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  // Step 2: Contact Details
  const step2 = (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          className="w-full p-2 border rounded-md"
          value={hospitalData.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Website</label>
        <input
          type="text"
          name="website"
          className="w-full p-2 border rounded-md"
          value={hospitalData.website}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Healthcare Type</label>
        <select
          name="healthcareType"
          className="w-full p-2 border rounded-md"
          value={hospitalData.healthcareType}
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          <option value="Primary Health Care">Primary Health Care</option>
          <option value="Secondary Health Care">Secondary Health Care</option>
          <option value="Clinic">Clinic</option>
        </select>
      </div>
    </div>
  );

  // Step 3: Location and Specialties
  const step3 = (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Google Map URL</label>
        <input
          type="text"
          name="googleMapUrl"
          className="w-full p-2 border rounded-md"
          value={hospitalData.googleMapUrl}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Latitude</label>
        <input
          type="number"
          name="latitude"
          className="w-full p-2 border rounded-md"
          value={hospitalData.coordinates.latitude}
          onChange={(e) => handleNestedChange('coordinates', 'latitude', e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Longitude</label>
        <input
          type="number"
          name="longitude"
          className="w-full p-2 border rounded-md"
          value={hospitalData.coordinates.longitude}
          onChange={(e) => handleNestedChange('coordinates', 'longitude', e.target.value)}
        />
      </div>
    </div>
  );

  // Step 4: Operating Hours
  const step4 = (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Operating Hours</label>
        <input
          type="text"
          name="operatingHours"
          className="w-full p-2 border rounded-md"
          placeholder="e.g., Mon-Fri 9:00 AM - 5:00 PM, Sat 9:00 AM - 1:00 PM"
          value={hospitalData.operatingHours}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  // Step 5: Login Details
  const step5 = (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Hospital ID</label>
        <input
          type="text"
          name="hospitalId"
          className="w-full p-2 border rounded-md"
          value={hospitalData.hospitalId}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          className="w-full p-2 border rounded-md"
          value={hospitalData.password}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className="w-full p-2 border rounded-md"
          value={hospitalData.confirmPassword}
          onChange={handleChange}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">


        <div className="flex flex-col items-center mb-6 animate-fade-in">
          <img src={logo} alt="Nesus Care Logo" className="h-16 md:h-20 mb-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 text-center">Nesus Care</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hospital Registration</h2>

        <form>
          {currentStep === 1 && step1}
          {currentStep === 2 && step2}
          {currentStep === 3 && step3}
          {currentStep === 4 && step4}
          {currentStep === 5 && step5}

          <div className="mt-4 flex justify-between">
            {currentStep > 1 && (
              <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={prevStep}>
                Previous
              </button>
            )}
            {/* {currentStep < totalSteps ? (
              <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={nextStep}>
                Next
              </button>
            ) : (
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
                Submit
              </button>
            )} */}

            {currentStep < 5 && (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={nextStep}
              >
                Next
              </button>
            )}
            {currentStep === 5 && (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default HospitalRegistrationForm;