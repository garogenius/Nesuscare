import { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { EventCard } from './components/EventCard';
import { FilterSection } from './components/FilterSection';
import { Layout } from '../../components/layout/Layout';

const events = [
  {
    id: 1,
    title: 'Healthcare Innovation Summit',
    type: 'Conference',
    date: '2024-04-15',
    time: '09:00 AM - 05:00 PM',
    location: 'Medical Convention Center',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=500&h=300',
    speakers: ['Dr. John Smith', 'Dr. Emily Chen'],
    attendees: 250,
    description: 'Join us for a day of exploring the latest healthcare innovations and technologies.',
  },
  {
    id: 2,
    title: 'Mental Health Awareness Workshop',
    type: 'Workshop',
    date: '2024-04-20',
    time: '02:00 PM - 04:00 PM',
    location: 'Community Health Center',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=500&h=300',
    speakers: ['Dr. Sarah Williams'],
    attendees: 50,
    description: 'A workshop focused on mental health awareness and coping strategies.',
  },
  {
    id: 3,
    title: 'Pediatric Care Symposium',
    type: 'Symposium',
    date: '2024-04-25',
    time: '10:00 AM - 03:00 PM',
    location: 'Children\'s Hospital Auditorium',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=500&h=300',
    speakers: ['Dr. Michael Johnson', 'Dr. Lisa Chen'],
    attendees: 150,
    description: 'Latest developments and best practices in pediatric care.',
  },
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Health Events</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
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
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}