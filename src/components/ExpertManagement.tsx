import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Edit, Trash2 } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  email: string;
  specialization: string;
}

const ExpertManagement: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [newExpert, setNewExpert] = useState({ name: '', email: '', specialization: '' });
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/experts');
      setExperts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching experts:', error);
      setError('Failed to fetch experts. Please try again later.');
      setExperts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingExpert) {
        await axios.put(`/api/experts/${editingExpert.id}`, newExpert);
      } else {
        await axios.post('/api/experts', newExpert);
      }
      fetchExperts();
      setNewExpert({ name: '', email: '', specialization: '' });
      setEditingExpert(null);
    } catch (error) {
      console.error('Error saving expert:', error);
      setError('Failed to save expert. Please try again.');
    }
  };

  const handleEdit = (expert: Expert) => {
    setEditingExpert(expert);
    setNewExpert({ name: expert.name, email: expert.email, specialization: expert.specialization });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/experts/${id}`);
      fetchExperts();
    } catch (error) {
      console.error('Error deleting expert:', error);
      setError('Failed to delete expert. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Expert Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingExpert ? 'Edit Expert' : 'Add New Expert'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newExpert.name}
              onChange={(e) => setNewExpert({ ...newExpert, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newExpert.email}
              onChange={(e) => setNewExpert({ ...newExpert, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Specialization"
              value={newExpert.specialization}
              onChange={(e) => setNewExpert({ ...newExpert, specialization: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            {editingExpert ? 'Update Expert' : 'Add Expert'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">Expert List</h3>
        {isLoading ? (
          <p className="p-4">Loading experts...</p>
        ) : experts.length === 0 ? (
          <p className="p-4">No experts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Specialization</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {experts.map((expert, index) => (
                  <tr key={expert.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-blue-500" />
                        <span>{expert.name}</span>
                      </div>
                    </td>
                    <td className="p-2">{expert.email}</td>
                    <td className="p-2">{expert.specialization}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(expert)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(expert.id)}
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

export default ExpertManagement;