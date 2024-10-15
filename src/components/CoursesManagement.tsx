import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Edit, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  duration: string;
  courseType: string;
  description: string;
  expert: string;
  status: string;
}

interface CourseType {
  id: string;
  name: string;
}

interface Expert {
  id: string;
  name: string;
}

const CoursesManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    name: '',
    duration: '',
    courseType: '',
    description: '',
    expert: '',
    status: '',
  });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    fetchCourseTypes();
    fetchExperts();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/courses');
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again later.');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourseTypes = async () => {
    try {
      const response = await axios.get('/api/course-types');
      setCourseTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching course types:', error);
      setCourseTypes([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingCourse) {
        await axios.put(`/api/courses/${editingCourse.id}`, newCourse);
      } else {
        await axios.post('/api/courses', newCourse);
      }
      fetchCourses();
      setNewCourse({
        name: '',
        duration: '',
        courseType: '',
        description: '',
        expert: '',
        status: '',
      });
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      setError('Failed to save course. Please try again.');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setNewCourse({ ...course });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Course Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Duration (e.g., 2 weeks, 3 months)"
              value={newCourse.duration}
              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newCourse.courseType}
              onChange={(e) => setNewCourse({ ...newCourse, courseType: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Course Type</option>
              {courseTypes.map((type) => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
            <select
              value={newCourse.expert}
              onChange={(e) => setNewCourse({ ...newCourse, expert: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Expert</option>
              {experts.map((expert) => (
                <option key={expert.id} value={expert.name}>{expert.name}</option>
              ))}
            </select>
            <select
              value={newCourse.status}
              onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
          <textarea
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            {editingCourse ? 'Update Course' : 'Add Course'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">Course List</h3>
        {isLoading ? (
          <p className="p-4">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="p-4">No courses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Duration</th>
                  <th className="p-2 text-left">Expert</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <Layers size={16} className="text-blue-500" />
                        <span>{course.name}</span>
                      </div>
                    </td>
                    <td className="p-2">{course.courseType}</td>
                    <td className="p-2">{course.duration}</td>
                    <td className="p-2">{course.expert}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        course.status === 'Active' ? 'bg-green-100 text-green-800' :
                        course.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
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

export default CoursesManagement;