import { Calendar, MapPin, Users } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  image: string;
  speakers: string[];
  attendees: number;
  description: string;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
        
        {/* Image Section */}
        <div className="col-span-1">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full rounded-lg object-cover border border-gray-200"
          />
        </div>
        
        {/* Event Details Section */}
        <div className="col-span-2 flex flex-col justify-between">
          {/* Title and Type */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {event.type}
              </span>
            </div>

            {/* Date, Time, and Location */}
            <div className="mt-4 space-y-2 text-gray-600">
              <div className="flex items-center text-sm font-medium">
                <Calendar className="mr-2 h-5 w-5 text-blue-700" />
                <span>{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center text-sm font-medium">
                <MapPin className="mr-2 h-5 w-5 text-blue-700" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-sm font-medium">
                <Users className="mr-2 h-5 w-5 text-blue-700" />
                <span>{event.attendees} attendees</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-6 text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Speakers */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900">Speakers</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {event.speakers.map((speaker) => (
                <span
                  key={speaker}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {speaker}
                </span>
              ))}
            </div>
          </div>

          {/* Register Button */}
          <div className="mt-6">
            <button className="w-full inline-flex justify-center items-center rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 transition-colors">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
