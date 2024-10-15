import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Edit, Trash2 } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const CandidateManagement: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '', phone: '' });
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/candidates');
      setCandidates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setError('Failed to fetch candidates. Please try again later.');
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingCandidate) {
        await axios.put(`/api/candidates/${editingCandidate.id}`, newCandidate);
      } else {
        await axios.post('/api/candidates', newCandidate);
      }
      fetchCandidates();
      setNewCandidate({ name: '', email: '', phone: '' });
      setEditingCandidate(null);
    } catch (error) {
      console.error('Error saving candidate:', error);
      setError('Failed to save candidate. Please try again.');
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setNewCandidate({ name: candidate.name, email: candidate.email, phone: candidate.phone });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/candidates/${id}`);
      fetchCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setError('Failed to delete candidate. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Candidate Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newCandidate.email}
            onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={newCandidate.phone}
            onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">Candidate List</h3>
        {isLoading ? (
          <p className="p-4">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p className="p-4">No candidates found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate, index) => (
                  <tr key={candidate.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-blue-500" />
                        <span>{candidate.name}</span>
                      </div>
                    </td>
                    <td className="p-2">{candidate.email}</td>
                    <td className="p-2">{candidate.phone}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(candidate.id)}
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

export default CandidateManagement;