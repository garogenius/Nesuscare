import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';

export default function Profile() {
  return (
    <Layout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <button className="inline-flex items-center rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 p-1">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                </div>
                <h2 className="mt-4 text-lg font-medium text-gray-900">
                  John Doe
                </h2>
                <p className="text-sm text-gray-500">Patient ID: #12345</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="mr-2 h-4 w-4" />
                  john.doe@example.com
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="mr-2 h-4 w-4" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="mr-2 h-4 w-4" />
                  New York, USA
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Joined March 2024
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-medium text-gray-900">Medical History</h3>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Blood Type
                  </h4>
                  <p className="text-sm text-gray-500">A+</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Allergies
                  </h4>
                  <p className="text-sm text-gray-500">Penicillin, Peanuts</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Chronic Conditions
                  </h4>
                  <p className="text-sm text-gray-500">None</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-medium text-gray-900">Recent Activity</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Doctor Appointment
                    </p>
                    <p className="text-sm text-gray-500">
                      With Dr. Sarah Johnson
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Health Check
                    </p>
                    <p className="text-sm text-gray-500">
                      Regular checkup
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}