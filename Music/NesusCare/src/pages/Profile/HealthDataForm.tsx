import React from 'react';
import { useState } from 'react';

export function HealthDataForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    medicalHistory: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    console.log(formData);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Health Data Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            id="height"
            name="height"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={formData.height}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">Medical History</label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={formData.medicalHistory}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
