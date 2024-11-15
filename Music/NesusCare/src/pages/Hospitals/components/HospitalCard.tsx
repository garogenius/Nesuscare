import { MapPin, Star, Phone, ExternalLink } from 'lucide-react';

interface Hospital {
  id: number;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  address: string;
  distance: string;
  image: string;
  services: string[];
}

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`;

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="aspect-video sm:aspect-square">
          <img
            src={hospital.image}
            alt={hospital.name}
            className="h-full w-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
          />
        </div>
        
        <div className="p-6 sm:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                <p className="text-sm text-gray-500">{hospital.type}</p>
              </div>
              <div className="flex items-center text-yellow-400">
                <Star className="h-5 w-5" />
                <span className="ml-1 text-sm font-semibold text-gray-700">{hospital.rating}</span>
                <span className="ml-1 text-sm text-gray-500">({hospital.reviews} reviews)</span>
              </div>
            </div>

            <div className="mt-3 flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" />
              <span>{hospital.address} • {hospital.distance}</span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Services</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {hospital.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="inline-flex items-center rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
              <Phone className="mr-2 h-4 w-4" />
              Contact
            </button>
            <button className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Details
            </button>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
