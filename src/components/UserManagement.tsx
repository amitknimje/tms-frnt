import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Edit, Trash2, Shield, Camera, FileText } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  candidateName: string;
  age: number;
  departmentName: string;
  idProofNo: string;
  mobileNumber: string;
  role: string;
  candidatePhoto?: string;
  idProofPhoto?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [newUser, setNewUser] = useState<Omit<UserData, 'id'>>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    candidateName: '',
    age: 0,
    departmentName: '',
    idProofNo: '',
    mobileNumber: '',
    role: '',
  });
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again later.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingUser) {
        await axios.put(`/api/users/${editingUser.id}`, newUser);
      } else {
        await axios.post('/api/users', newUser);
      }
      fetchUsers();
      setNewUser({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        candidateName: '',
        age: 0,
        departmentName: '',
        idProofNo: '',
        mobileNumber: '',
        role: '',
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user. Please try again.');
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setNewUser({ ...user });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'candidatePhoto' | 'idProofPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser({ ...newUser, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">User Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingUser ? 'Edit User' : 'Add New User'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Candidate Name"
              value={newUser.candidateName}
              onChange={(e) => setNewUser({ ...newUser, candidateName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={newUser.age}
              onChange={(e) => setNewUser({ ...newUser, age: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Department Name"
              value={newUser.departmentName}
              onChange={(e) => setNewUser({ ...newUser, departmentName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="ID Proof Number"
              value={newUser.idProofNo}
              onChange={(e) => setNewUser({ ...newUser, idProofNo: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={newUser.mobileNumber}
              onChange={(e) => setNewUser({ ...newUser, mobileNumber: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <Camera size={16} />
              <span>Upload Candidate Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'candidatePhoto')}
                className="hidden"
              />
            </label>
            {newUser.candidatePhoto && <span className="text-green-500">Photo uploaded</span>}
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <FileText size={16} />
              <span>Upload ID Proof Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'idProofPhoto')}
                className="hidden"
              />
            </label>
            {newUser.idProofPhoto && <span className="text-green-500">ID Proof uploaded</span>}
          </div>
          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            {editingUser ? 'Update User' : 'Add User'}
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">User List</h3>
        {isLoading ? (
          <p className="p-4">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-4">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        {user.candidatePhoto && (
                          <img src={user.candidatePhoto} alt="Candidate" className="w-8 h-8 rounded-full" />
                        )}
                        <span>{user.candidateName}</span>
                      </div>
                    </td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <span className="flex items-center">
                        <Shield size={16} className="mr-1" /> {user.role}
                      </span>
                    </td>
                    <td className="p-2">{user.departmentName}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700"
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

export default UserManagement;