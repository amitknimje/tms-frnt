import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard: React.FC = () => {
  const monthlyParticipationChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Course Participation',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const courseTypeChart = {
    labels: ['Basic', 'Advanced', 'Expert'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      },
    ],
  };

  const courseStatusChart = {
    labels: ['Ongoing', 'Completed', 'Upcoming'],
    datasets: [
      {
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Welcome to the Training Management System</p>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4">Monthly Course Participation</h2>
          <div style={{ height: '240px' }}>
            <Bar 
              data={monthlyParticipationChart} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Course Type Distribution</h2>
            <div style={{ height: '240px' }}>
              <Pie 
                data={courseTypeChart} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false 
                }} 
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Course Status Distribution</h2>
            <div style={{ height: '240px' }}>
              <Pie 
                data={courseStatusChart} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false 
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;