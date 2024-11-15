import { useState } from 'react';
import { Search, Calendar, Video, MessageSquare, Star } from 'lucide-react';
import { DoctorCard } from './components/DoctorCard';
import { FilterSection } from './components/FilterSection';
import { Layout } from '../../components/layout/Layout';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.8,
    reviews: 124,
    availability: 'Available Today',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '15 years',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    rating: 4.9,
    reviews: 89,
    availability: 'Next Available: Tomorrow',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '12 years',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.7,
    reviews: 156,
    availability: 'Available Today',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300',
    experience: '8 years',
  },
];

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-gray-300 pl-10 focus:border-rose-500 focus:ring-rose-500 sm:w-72"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <FilterSection />
        
        <div className="lg:col-span-3">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}