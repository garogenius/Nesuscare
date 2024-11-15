import { Phone } from 'lucide-react';

const emergencyCalls = [
  {
    id: 1,
    type: 'Ambulance',
    time: '2024-03-15 14:30',
    status: 'Completed',
    duration: '12m',
  },
  {
    id: 2,
    type: 'Hospital',
    time: '2024-03-14 09:15',
    status: 'Completed',
    duration: '8m',
  },
  {
    id: 3,
    type: 'Doctor',
    time: '2024-03-13 18:45',
    status: 'Missed',
    duration: '-',
  },
];

export function EmergencyCallLog() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Emergency Call Log</h3>
      <div className="mt-6">
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {emergencyCalls.map((call) => (
              <li key={call.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50">
                      <Phone className="h-5 w-5 text-rose-600" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {call.type}
                    </p>
                    <p className="truncate text-sm text-gray-500">{call.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        call.status === 'Completed'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {call.status}
                    </span>
                    <span className="text-sm text-gray-500">{call.duration}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}