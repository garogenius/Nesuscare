import { Menu, Bell, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    // Clear session data
    localStorage.removeItem('authToken');  // Adjust based on your session management
    setLogoutModalOpen(false);
    
    // Navigate to login page
    navigate('/login');
  };

  const cancelLogout = () => {
    setLogoutModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6 text-gray-500" />
        </button>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <Bell className="h-6 w-6" />
          </button>

          {/* User Icon with Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-2 rounded-full p-2 text-gray-500 hover:bg-gray-100"
              onClick={toggleDropdown}
            >
              <div className="h-12 w-12 rounded-full bg-gray-200 p-2 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-500" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-4 w-120 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
                <div className="py-3">
                  <Link
                    to="/profile"
                    className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <span className="font-semibold">Profile</span>
                  </Link>
                  <Link
                    to="/health-data"
                    className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <span className="font-semibold">Health Data</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-6 py-4 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <span className="font-semibold">Settings</span>
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full px-6 py-4 text-sm text-red-600 hover:bg-gray-100 rounded-md transition-all duration-200"
                  >
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg w-96 p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900">Are you sure you want to log out?</h3>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
