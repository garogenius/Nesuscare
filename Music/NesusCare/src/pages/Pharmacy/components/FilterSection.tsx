export function FilterSection() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="font-medium text-gray-900">Filters</h2>
      
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Categories</option>
            <option>Pain Relief</option>
            <option>Vitamins</option>
            <option>Medical Devices</option>
            <option>First Aid</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Price Range</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Prices</option>
            <option>Under $10</option>
            <option>$10 - $25</option>
            <option>$25 - $50</option>
            <option>Over $50</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Prescription</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Items</option>
            <option>No Prescription Required</option>
            <option>Prescription Required</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Brand</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
            <option>All Brands</option>
            <option>Generic</option>
            <option>Brand Name</option>
          </select>
        </div>
      </div>
    </div>
  );
}