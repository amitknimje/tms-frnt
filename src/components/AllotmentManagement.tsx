import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Edit, Trash2 } from 'lucide-react';

interface Allotment {
  id: string;
  candidateName: string;
  courseName: string;
  courseType: string;
  expertName: string;
  date: string;
  location: string;
}

interface Course {
  id: string;
  name: string;
  type: string;
}

interface Expert {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

const AllotmentManagement: React.FC = () => {
  const [allotments, setAllotments] = useState<Allotment[]>([]);
  const [newAllotment, setNewAllotment] = useState<Omit<Allotment, 'id'>>({
    candidateName: '',
    courseName: '',
    courseType: '',
    expertName: '',
    date: '',
    location: '',
  });
  const [editingAllotment, setEditingAllotment] = useState<Allotment | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllotments();
    fetchCourses();
    fetchExperts();
    fetchLocations();
  }, []);

  const fetchAllotments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/allotments');
      setAllotments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching allotments:', error);
      setError('Failed to fetch allotments. Please try again later.');
      setAllotments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await axios.get('/api/experts');
      setExperts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching experts:', error);
      setExperts([]);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/locations');
      setLocations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingAllotment) {
        await axios.put(`/api/allotments/${editingAllotment.id}`, newAllotment);
      } else {
        await axios.post('/api/allotments', newAllotment);
      }
      fetchAllotments();
      setNewAllotment({
        candidateName: '',
        courseName: '',
        courseType: '',
        expertName: '',
        date: '',
        location: '',
      });
      setEditingAllotment(null);
    } catch (error) {
      console.error('Error saving allotment:', error);
      setError('Failed to save allotment. Please try again.');
    }
  };

  const handleEdit = (allotment: Allotment) => {
    setEditingAllotment(allotment);
    setNewAllotment({
      candidateName: allotment.candidateName,
      courseName: allotment.courseName,
      courseType: allotment.courseType,
      expertName: allotment.expertName,
      date: allotment.date,
      location: allotment.location,
    });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/allotments/${id}`);
      fetchAllotments();
    } catch (error) {
      console.error('Error deleting allotment:', error);
      setError('Failed to delete allotment. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Course Allotment Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingAllotment ? 'Edit Allotment' : 'Add New Allotment'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Candidate Name"
              value={newAllotment.candidateName}
              onChange={(e) => setNewAllotment({ ...newAllotment, candidateName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newAllotment.courseName}
              onChange={(e) => {
                const selectedCourse = courses.find(course => course.name === e.target.value);
                setNewAllotment({
                  ...newAllotment,
                  courseName: e.target.value,
                  courseType: selectedCourse ? selectedCourse.type : '',
                });
              }}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.name}>{course.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Course Type"
              value={newAllotment.courseType}
              className="w-full p-2 border rounded bg-gray-100"
              readOnly
            />
            <select
              value={newAllotment.expertName}
              onChange={(e) => setNewAllotment({ ...newAllotment, expertName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Expert</option>
              {experts.map((expert) => (
                <option key={expert.id} value={expert.name}>{expert.name}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Date"
              value={newAllotment.date}
              onChange={(e) => setNewAllotment({ ...newAllotment, date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newAllotment.location}
              onChange={(e) => setNewAllotment({ ...newAllotment, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.name}>{location.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            {editingAllotment ? 'Update Allotment' : 'Add Allotment'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">Allotment List</h3>
        {isLoading ? (
          <p className="p-4">Loading allotments...</p>
        ) : allotments.length === 0 ? (
          <p className="p-4">No allotments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Candidate</th>
                  <th className="p-2 text-left">Course</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Expert</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allotments.map((allotment, index) => (
                  <tr key={allotment.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">{allotment.candidateName}</td>
                    <td className="p-2">{allotment.courseName}</td>
                    <td className="p-2">{allotment.courseType}</td>
                    <td className="p-2">{allotment.expertName}</td>
                    <td className="p-2">{allotment.date}</td>
                    <td className="p-2">{allotment.location}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(allotment)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(allotment.id)}
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

export default AllotmentManagement;