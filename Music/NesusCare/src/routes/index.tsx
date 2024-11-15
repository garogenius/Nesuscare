import { Sidebar } from 'lucide-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import ChatAI from '../pages/ChatAI';
import Dashboard from '../pages/Dashboard';
import Doctors from '../pages/Doctors';
import DPPRoom from '../pages/DPPRoom';
import EmergencyContacts from '../pages/EmergencyContacts';
import Events from '../pages/Events';
import Hospitals from '../pages/Hospitals';
import Pharmacy from '../pages/Pharmacy';
import Profile from '../pages/Profile';
import Settings from '../pages/Profile/Setting';
import { HealthDataForm } from '../pages/Profile/HealthDataForm';
import { LoginForm } from '../pages/Profile/LoginForm';
import { Logout } from '../pages/Profile/Logout';
import { RegistrationForm } from '../pages/Profile/RegistrationForm';
import { PatientRegistrationForm } from '../components/layout/PatientRegistrationForm';
import { RegistrationSelection } from '../components/RegistrationSelection';
import { DoctorRegistrationForm } from '../components/layout/DoctorRegistrationForm';
import { HospitalRegistrationForm } from '../components/layout/HospitalRegistrationForm';

export function AppRoutes() {
 

  return (
    <>


      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/signup" element={<RegistrationSelection />} />
        <Route path="/register/patient" element={<PatientRegistrationForm />} />
        <Route path="/register/hospital" element={<HospitalRegistrationForm />} />
        {/* <Route path="/register/pharmacy" element={<PharmacyRegistrationForm />} /> */}
        <Route path="/register/doctor" element={<DoctorRegistrationForm />} />
        
        <Route path="/emergency-contacts" element={<EmergencyContacts />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/events" element={<Events />} />
        <Route path="/dpp-room" element={<DPPRoom />} />
        <Route path="/chat-ai" element={<ChatAI />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/health-data" element={<HealthDataForm />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}
