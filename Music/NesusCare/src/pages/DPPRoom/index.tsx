import { useState } from 'react';
import { Search, Video, MessageSquare, Users } from 'lucide-react';
import { RoomCard } from './components/RoomCard';
import { FilterSection } from './components/FilterSection';
import { Layout } from '../../components/layout/Layout';

const rooms = [
  {
    id: 1,
    title: 'Diabetes Prevention Program',
    type: 'Prevention',
    status: 'Live',
    participants: 15,
    maxParticipants: 20,
    host: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500&h=300',
    description: 'Join our comprehensive program for diabetes prevention and management.',
  },
  {
    id: 2,
    title: 'Heart Health Discussion',
    type: 'Discussion',
    status: 'Scheduled',
    startTime: '2024-03-20 14:00',
    participants: 0,
    maxParticipants: 30,
    host: 'Dr. Michael Chen',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=500&h=300',
    description: 'Expert-led discussion on maintaining heart health and preventing cardiovascular diseases.',
  },
  {
    id: 3,
    title: 'Mental Wellness Workshop',
    type: 'Workshop',
    status: 'Live',
    participants: 25,
    maxParticipants: 25,
    host: 'Dr. Emily Rodriguez',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=500&h=300',
    description: 'Interactive workshop focusing on mental health and stress management techniques.',
  },
];

export default function DPPRoom() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Disease Prevention Programs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Join virtual rooms for health discussions and prevention programs
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
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
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}