import { useState } from 'react';
import { Wifi, X } from 'lucide-react';

export function DeviceConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleConnectClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsConnected(true);
    setShowForm(false);
    setShowSuccessDialog(true);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={handleConnectClick}
        className={`inline-flex items-center justify-center w-full max-w-xs rounded-lg px-4 py-2 text-sm font-medium shadow-sm ${
          isConnected
            ? 'bg-green-50 text-green-700 hover:bg-green-100'
            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
        }`}
      >
        <Wifi className="mr-2 h-4 w-4" />
        {isConnected ? 'Connected' : 'Connect Device'}
      </button>

      {/* Modal for Device Code Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-xs w-full mx-4">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
              <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-2">
                Device Code or Device ID
              </label>
              <input
                type="text"
                id="deviceId"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              />
              <button
                type="submit"
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Connect Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs w-full mx-4">
            <p className="text-lg font-semibold text-green-700">Device connected successfully!</p>
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
