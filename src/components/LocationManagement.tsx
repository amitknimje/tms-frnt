import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Edit, Trash2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
}

const LocationManagement: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocation, setNewLocation] = useState<Omit<Location, 'id'>>({ name: '', address: '' });
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/locations');
      setLocations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to fetch locations. Please try again later.');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingLocation) {
        await axios.put(`/api/locations/${editingLocation.id}`, newLocation);
      } else {
        await axios.post('/api/locations', newLocation);
      }
      fetchLocations();
      setNewLocation({ name: '', address: '' });
      setEditingLocation(null);
    } catch (error) {
      console.error('Error saving location:', error);
      setError('Failed to save location. Please try again.');
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setNewLocation({ name: location.name, address: location.address });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/locations/${id}`);
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      setError('Failed to delete location. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Location Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingLocation ? 'Edit Location' : 'Add New Location'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Location Name"
            value={newLocation.name}
            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Address"
            value={newLocation.address}
            onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            {editingLocation ? 'Update Location' : 'Add Location'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">Location List</h3>
        {isLoading ? (
          <p className="p-4">Loading locations...</p>
        ) : locations.length === 0 ? (
          <p className="p-4">No locations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Address</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location, index) => (
                  <tr key={location.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-blue-500" />
                        <span>{location.name}</span>
                      </div>
                    </td>
                    <td className="p-2">{location.address}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(location)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationManagement;