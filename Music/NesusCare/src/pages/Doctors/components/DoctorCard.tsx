import { Calendar, Video, MessageSquare, Star } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  availability: string;
  image: string;
  experience: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-square">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
        <p className="text-sm text-gray-500">{doctor.specialty}</p>
        
        <div className="mt-2 flex items-center">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
          <span className="ml-1 text-sm text-gray-500">
            ({doctor.reviews} reviews)
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">{doctor.experience}</p>
        
        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">
            <Calendar className="mx-auto h-4 w-4" />
          </button>
          <button className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
            <Video className="mx-auto h-4 w-4" />
          </button>
          <button className="flex-1 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100">
            <MessageSquare className="mx-auto h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}