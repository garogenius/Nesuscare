import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can handle login logic here
    console.log(credentials);
    // Redirect to the dashboard or home page after login
    navigate('/');
  };

  const handleRedirectToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="max-w-sm mx-auto mt-60 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleRedirectToRegister}
          className="text-blue-600 hover:underline"
        >
          Don't have an account? Register here
        </button>
      </div>
    </div>
  );
}
