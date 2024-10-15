import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Download, Edit, Trash2 } from 'lucide-react';

interface Certificate {
  id: string;
  candidateName: string;
  course: string;
  courseType: string;
  duration: string;
  status: string;
}

const CertificateGeneration: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, 'id'>>({
    candidateName: '',
    course: '',
    courseType: '',
    duration: '',
    status: 'Pending',
  });
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/certificates');
      setCertificates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setError('Failed to fetch certificates. Please try again later.');
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingCertificate) {
        await axios.put(`/api/certificates/${editingCertificate.id}`, newCertificate);
      } else {
        await axios.post('/api/certificates', newCertificate);
      }
      fetchCertificates();
      setNewCertificate({
        candidateName: '',
        course: '',
        courseType: '',
        duration: '',
        status: 'Pending',
      });
      setEditingCertificate(null);
    } catch (error) {
      console.error('Error saving certificate:', error);
      setError('Failed to save certificate. Please try again.');
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setNewCertificate({ ...certificate });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/certificates/${id}`);
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setError('Failed to delete certificate. Please try again.');
    }
  };

  const handleDownload = (certificate: Certificate) => {
    // Implement certificate download logic here
    console.log('Downloading certificate for:', certificate.candidateName);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Certificate Generation</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingCertificate ? 'Edit Certificate' : 'Generate New Certificate'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Candidate Name"
              value={newCertificate.candidateName}
              onChange={(e) => setNewCertificate({ ...newCertificate, candidateName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Course"
              value={newCertificate.course}
              onChange={(e) => setNewCertificate({ ...newCertificate, course: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Course Type"
              value={newCertificate.courseType}
              onChange={(e) => setNewCertificate({ ...newCertificate, courseType: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Duration"
              value={newCertificate.duration}
              onChange={(e) => setNewCertificate({ ...newCertificate, duration: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newCertificate.status}
              onChange={(e) => setNewCertificate({ ...newCertificate, status: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Generated">Generated</option>
              <option value="Issued">Issued</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            {editingCertificate ? 'Update Certificate' : 'Generate Certificate'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">Certificate List</h3>
        {isLoading ? (
          <p className="p-4">Loading certificates...</p>
        ) : certificates.length === 0 ? (
          <p className="p-4">No certificates found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Candidate Name</th>
                  <th className="p-2 text-left">Course</th>
                  <th className="p-2 text-left">Course Type</th>
                  <th className="p-2 text-left">Duration</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate, index) => (
                  <tr key={certificate.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">{certificate.candidateName}</td>
                    <td className="p-2">{certificate.course}</td>
                    <td className="p-2">{certificate.courseType}</td>
                    <td className="p-2">{certificate.duration}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        certificate.status === 'Generated' ? 'bg-green-100 text-green-800' :
                        certificate.status === 'Issued' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {certificate.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(certificate)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(certificate.id)}
                          className="text-red-500 hover:text-red-700 transition duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(certificate)}
                          className="text-green-500 hover:text-green-700 transition duration-300"
                        >
                          <Download size={16} />
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

export default CertificateGeneration;