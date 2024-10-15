import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LocationManagement from './components/LocationManagement';
import CandidateManagement from './components/CandidateManagement';
import CourseTypeManagement from './components/CourseTypeManagement';
import CoursesManagement from './components/CoursesManagement';
import AllotmentManagement from './components/AllotmentManagement';
import ExpertManagement from './components/ExpertManagement';
import EvaluationManagement from './components/EvaluationManagement';
import UserManagement from './components/UserManagement';
import CertificateGeneration from './components/CertificateGeneration';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <nav className="bg-blue-600 text-white w-48 p-4 overflow-y-auto">
          <div className="text-lg font-bold mb-6">TMS</div>
          <ul className="space-y-2">
            <li><Link to="/" className="block hover:bg-blue-700 px-2 py-1 rounded">Dashboard</Link></li>
            <li><Link to="/locations" className="block hover:bg-blue-700 px-2 py-1 rounded">Locations</Link></li>
            <li><Link to="/candidates" className="block hover:bg-blue-700 px-2 py-1 rounded">Candidates</Link></li>
            <li><Link to="/course-types" className="block hover:bg-blue-700 px-2 py-1 rounded">Course Types</Link></li>
            <li><Link to="/courses" className="block hover:bg-blue-700 px-2 py-1 rounded">Courses</Link></li>
            <li><Link to="/allotments" className="block hover:bg-blue-700 px-2 py-1 rounded">Allotments</Link></li>
            <li><Link to="/experts" className="block hover:bg-blue-700 px-2 py-1 rounded">Experts</Link></li>
            <li><Link to="/evaluations" className="block hover:bg-blue-700 px-2 py-1 rounded">Evaluations</Link></li>
            <li><Link to="/users" className="block hover:bg-blue-700 px-2 py-1 rounded">Users</Link></li>
            <li><Link to="/certificates" className="block hover:bg-blue-700 px-2 py-1 rounded">Certificates</Link></li>
          </ul>
        </nav>
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/locations" element={<LocationManagement />} />
            <Route path="/candidates" element={<CandidateManagement />} />
            <Route path="/course-types" element={<CourseTypeManagement />} />
            <Route path="/courses" element={<CoursesManagement />} />
            <Route path="/allotments" element={<AllotmentManagement />} />
            <Route path="/experts" element={<ExpertManagement />} />
            <Route path="/evaluations" element={<EvaluationManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/certificates" element={<CertificateGeneration />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;