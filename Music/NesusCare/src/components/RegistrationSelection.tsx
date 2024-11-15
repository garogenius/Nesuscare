// src/components/RegistrationSelection.tsx
import { useNavigate } from 'react-router-dom';

export function RegistrationSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/path-to-your-health-background.jpg')]">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Register as</h2>
        <p className="text-gray-600 mb-8">Select your role to create an account</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/register/patient')}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Patient
          </button>
          <button
            onClick={() => navigate('/register/hospital')}
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            Hospital/Clinic
          </button>
          <button
            onClick={() => navigate('/register/pharmacy')}
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
          >
            Pharmacy
          </button>
          <button
            onClick={() => navigate('/register/doctor')}
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
          >
            Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
