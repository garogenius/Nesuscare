export function FilterSection() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-medium text-gray-900">Filters</h2>
      
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Room Type</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Types</option>
            <option>Prevention</option>
            <option>Discussion</option>
            <option>Workshop</option>
            <option>Seminar</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Status</option>
            <option>Live</option>
            <option>Scheduled</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Topic</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Topics</option>
            <option>Diabetes</option>
            <option>Heart Health</option>
            <option>Mental Health</option>
            <option>General Wellness</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Availability</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>Any Availability</option>
            <option>Has Open Spots</option>
            <option>Full</option>
          </select>
        </div>
      </div>
    </div>
  );
}
