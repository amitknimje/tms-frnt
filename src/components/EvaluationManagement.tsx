import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, Edit, Trash2, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Evaluation {
  id: string;
  candidateName: string;
  courseName: string;
  courseType: string;
  location: string;
  duration: string;
  date: string;
  status: string;
  remark: string;
  marks: number;
}

const EvaluationManagement: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [newEvaluation, setNewEvaluation] = useState<Omit<Evaluation, 'id'>>({
    candidateName: '',
    courseName: '',
    courseType: '',
    location: '',
    duration: '',
    date: '',
    status: '',
    remark: '',
    marks: 0,
  });
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/evaluations');
      setEvaluations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      setError('Failed to fetch evaluations. Please try again later.');
      setEvaluations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingEvaluation) {
        await axios.put(`/api/evaluations/${editingEvaluation.id}`, newEvaluation);
      } else {
        await axios.post('/api/evaluations', newEvaluation);
      }
      fetchEvaluations();
      setNewEvaluation({
        candidateName: '',
        courseName: '',
        courseType: '',
        location: '',
        duration: '',
        date: '',
        status: '',
        remark: '',
        marks: 0,
      });
      setEditingEvaluation(null);
    } catch (error) {
      console.error('Error saving evaluation:', error);
      setError('Failed to save evaluation. Please try again.');
    }
  };

  const handleEdit = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation);
    setNewEvaluation({ ...evaluation });
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await axios.delete(`/api/evaluations/${id}`);
      fetchEvaluations();
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      setError('Failed to delete evaluation. Please try again.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const formattedData = data.map((row: any) => ({
          candidateName: row['Candidate Name'],
          courseName: row['Course Name'],
          courseType: row['Course Type'],
          location: row['Location'],
          duration: row['Duration'],
          date: row['Date'],
          status: row['Status'],
          remark: row['Remark'],
          marks: 0, // You may want to add a column for marks in the Excel file
        }));

        await axios.post('/api/evaluations/bulk', formattedData);
        fetchEvaluations();
      } catch (error) {
        console.error('Error processing file:', error);
        setError('Failed to process the uploaded file. Please check the file format and try again.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Evaluation Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {editingEvaluation ? 'Edit Evaluation' : 'Add New Evaluation'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Candidate Name"
              value={newEvaluation.candidateName}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, candidateName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Course Name"
              value={newEvaluation.courseName}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, courseName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Course Type"
              value={newEvaluation.courseType}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, courseType: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={newEvaluation.location}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Duration"
              value={newEvaluation.duration}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, duration: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              placeholder="Date"
              value={newEvaluation.date}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Status"
              value={newEvaluation.status}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, status: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Marks"
              value={newEvaluation.marks}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, marks: Number(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <textarea
            placeholder="Remark"
            value={newEvaluation.remark}
            onChange={(e) => setNewEvaluation({ ...newEvaluation, remark: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
          />
          <div className="flex justify-between items-center">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
              {editingEvaluation ? 'Update Evaluation' : 'Add Evaluation'}
            </button>
            <div>
              <label htmlFor="file-upload" className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-flex items-center transition duration-300">
                <Upload size={16} className="mr-2" />
                <span>Upload Excel</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </form>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-4 bg-gray-100">Evaluation List</h3>
        {isLoading ? (
          <p className="p-4">Loading evaluations...</p>
        ) : evaluations.length === 0 ? (
          <p className="p-4">No evaluations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Candidate</th>
                  <th className="p-2 text-left">Course</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Location</th>
                  <th className="p-2 text-left">Duration</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Marks</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evaluation, index) => (
                  <tr key={evaluation.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2">{evaluation.candidateName}</td>
                    <td className="p-2">{evaluation.courseName}</td>
                    <td className="p-2">{evaluation.courseType}</td>
                    <td className="p-2">{evaluation.location}</td>
                    <td className="p-2">{evaluation.duration}</td>
                    <td className="p-2">{evaluation.date}</td>
                    <td className="p-2">{evaluation.status}</td>
                    <td className="p-2">{evaluation.marks}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(evaluation)}
                          className="text-blue-500 hover:text-blue-700 transition duration-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(evaluation.id)}
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

export default EvaluationManagement;