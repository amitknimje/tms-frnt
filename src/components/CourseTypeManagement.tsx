import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Edit, Trash2 } from 'lucide-react';

interface CourseType {
  id: string;
  name: string;
  description: string;
}

const CourseTypeManagement: React.FC = () => {
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [newCourseType, setNewCourseType] = useState({ name: '', description: '' });
  const [editingCourseType, setEditingCourseType] = useState<CourseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseTypes();
  }, []);

  const fetchCourseTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/course-types');
      setCourseTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching course types:', error);
      setError('Failed to fetch course types. Please try again later.');
      setCourseTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingCourseType) {
        await axios.put(`/api/course-types/${editingCourseType.id}`, newCourseType);
      } else {
        await axios.post('/api/course-types', newCourseType);
      }
      fetchCourseTypes();
      setNewCourseType({ name: '', description: '' });
      setEditingCourseType(null);
    } catch (error) {
      console.error('Error saving course type:', error);
      setError('Failed to save course type. Please try again.');
    }
  };

  const handleEdit = (courseType: CourseType) => {
    setEditingCourseType(courseType);
    setNewCourseType({ name: courseType.name, description: courseType.description });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/course-types/${id}`);
      fetchCourseTypes();
    } catch (error) {
      console.error('Error deleting course type:', error);
      setError('Failed to delete course type. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Course Type Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingCourseType ? 'Edit Course Type' : 'Add New Course Type'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Course Type Name"
            value={newCourseType.name}
            onChange={(e) => setNewCourseType({ ...newCourseType, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={newCourseType.description}
            onChange={(e) => setNewCourseType({ ...newCourseType, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            {editingCourseType ? 'Update Course Type' : 'Add Course Type'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">Course Type List</h3>
        {isLoading ? (
          <p className="p-4">Loading course types...</p>
        ) : courseTypes.length === 0 ? (
          <p className="p-4">No course types found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courseTypes.map((courseType, index) => (
                  <tr key={courseType.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <BookOpen size={16} className="text-blue-500" />
                        <span>{courseType.name}</span>
                      </div>
                    </td>
                    <td className="p-2">{courseType.description}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(courseType)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(courseType.id)}
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

export default CourseTypeManagement;