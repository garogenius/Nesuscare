import React, { useState } from 'react';
import { Phone, Plus, Import } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';

const initialContacts = [
  {
    id: 1,
    name: 'City General Hospital',
    number: '+1 (555) 123-4567',
    category: 'Hospital',
    type: 'Emergency Room',
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    number: '+1 (555) 234-5678',
    category: 'Doctor',
    type: 'Cardiologist',
  },
  {
    id: 3,
    name: 'Eye Care Center',
    number: '+1 (555) 345-6789',
    category: 'Hospital',
    type: 'Eye Emergency',
  },
];

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState(initialContacts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    number: '',
    category: '',
    type: '',
  });

  // Handler for adding a new contact
  const handleAddContact = () => {
    setContacts([
      ...contacts,
      { id: contacts.length + 1, ...newContact },
    ]);
    setIsAddModalOpen(false);
    setNewContact({ name: '', number: '', category: '', type: '' });
  };

  // Simulate importing a contact from device
  const handleImportContact = () => {
    const importedContact = {
      id: contacts.length + 1,
      name: 'Imported Contact',
      number: '+1 (555) 678-9101',
      category: 'Imported',
      type: 'Unknown',
    };
    setContacts([...contacts, importedContact]);
    setIsImportDialogOpen(false);
  };

  return (
    <Layout>
    <div className="space-y-6">
      {/* Header with Add and Import buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
        <div className="flex space-x-3">
          <button
            className="inline-flex items-center rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </button>
          <button
            className="inline-flex items-center rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Import className="mr-2 h-4 w-4" />
            Import
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <ul className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <li key={contact.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
                    <Phone className="h-5 w-5 text-rose-600" />
                  </span>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-500">{contact.number}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {contact.category}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {contact.type}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
       {/* Add Contact Modal */}
       {isAddModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Contact</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddContact();
                }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 p-2"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Emergency Number"
                    value={newContact.number}
                    onChange={(e) =>
                      setNewContact({ ...newContact, number: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 p-2"
                    required
                  />
          
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={newContact.category}
                      onChange={(e) =>
                        setNewContact({ ...newContact, category: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 p-2"
                    >
                      <option value="">Select Category</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  </div>
          
                  {/* Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={newContact.type}
                      onChange={(e) =>
                        setNewContact({ ...newContact, type: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 p-2"
                    >
                      <option value="">Select Type</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Emergency Room">Emergency Room</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Orthopedic">Orthopedic</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
                  >
                    Add Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}

         
      {/* Import Dialog */}
      {isImportDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <Import className="mx-auto mb-4 h-10 w-10 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Import Contact</h2>
            <p className="text-sm text-gray-600 mb-4">
              Import a contact from your device.
            </p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleImportContact}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Import Contact
              </button>
              <button
                onClick={() => setIsImportDialogOpen(false)}
                className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}