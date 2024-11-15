export function FilterSection() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-medium text-gray-900">Filters</h2>
      
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Specialty</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Specialties</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Pediatrics</option>
            <option>Dermatology</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Availability</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>Any Time</option>
            <option>Available Today</option>
            <option>Next 3 Days</option>
            <option>Next Week</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Experience</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>Any Experience</option>
            <option>1-5 years</option>
            <option>5-10 years</option>
            <option>10+ years</option>
          </select>
        </div>
      </div>
    </div>
  );
}