import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { HospitalCard } from './components/HospitalCard';
import { FilterSection } from './components/FilterSection';
import { Layout } from '../../components/layout/Layout';

const hospitals = [
  {
    id: 1,
    name: 'City General Hospital',
    type: 'General Hospital',
    rating: 4.5,
    reviews: 328,
    address: '123 Healthcare Ave, Medical District',
    distance: '2.5 km',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=500&h=300',
    services: ['Emergency Care', 'Surgery', 'Pediatrics', 'Cardiology'],
  },
  {
    id: 2,
    name: 'Memorial Medical Center',
    type: 'Specialty Hospital',
    rating: 4.8,
    reviews: 245,
    address: '456 Health Street, Wellness Square',
    distance: '3.8 km',
    image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=500&h=300',
    services: ['Cancer Care', 'Neurology', 'Orthopedics'],
  },
  {
    id: 3,
    name: 'Children\'s Hope Hospital',
    type: 'Children\'s Hospital',
    rating: 4.9,
    reviews: 189,
    address: '789 Care Lane, Healing Heights',
    distance: '5.2 km',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=500&h=300',
    services: ['Pediatric Emergency', 'NICU', 'Child Psychology'],
  },
];

export default function Hospitals() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Find Hospitals</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-gray-300 pl-10 focus:border-rose-500 focus:ring-rose-500 sm:w-72"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <FilterSection />
        
        <div className="lg:col-span-3">
          <div className="grid gap-6">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}