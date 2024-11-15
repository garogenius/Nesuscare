export function FilterSection() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-medium text-gray-900">Filters</h2>
      
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Event Type</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Types</option>
            <option>Conference</option>
            <option>Workshop</option>
            <option>Symposium</option>
            <option>Seminar</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Date Range</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>Any Time</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Next Month</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Location</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Locations</option>
            <option>Convention Center</option>
            <option>Hospitals</option>
            <option>Community Centers</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Topic</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Topics</option>
            <option>Healthcare Innovation</option>
            <option>Mental Health</option>
            <option>Pediatrics</option>
            <option>General Medicine</option>
          </select>
        </div>
      </div>
    </div>
  );
}