import { useNavigate } from 'react-router-dom';

export function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session data or authentication state
    localStorage.removeItem('authToken');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Logout
    </button>
  );
}
