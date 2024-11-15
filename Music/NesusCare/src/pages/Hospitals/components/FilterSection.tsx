export function FilterSection() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-medium text-gray-900">Filters</h2>
      
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Types</option>
            <option>General Hospital</option>
            <option>Specialty Hospital</option>
            <option>Children's Hospital</option>
            <option>Psychiatric Hospital</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Distance</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>Any Distance</option>
            <option>Within 5 km</option>
            <option>Within 10 km</option>
            <option>Within 20 km</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Services</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Services</option>
            <option>Emergency Care</option>
            <option>Surgery</option>
            <option>Pediatrics</option>
            <option>Cardiology</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Rating</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>Any Rating</option>
            <option>4+ Stars</option>
            <option>3+ Stars</option>
            <option>2+ Stars</option>
          </select>
        </div>
      </div>
    </div>
  );
}