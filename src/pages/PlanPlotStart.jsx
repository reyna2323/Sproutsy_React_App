import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlanPlotStart() {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center min-h-screen bg-[#f5f5f5]">
      <h1 className="text-2xl font-bold mb-4">Plan New Plot</h1>
      <p className="mb-6 text-gray-700">
        Let’s get started! You can enter the size of your garden plot manually below.
      </p>
      <button
        onClick={() => navigate('/manual-plot')}
        className="bg-green-600 text-white py-2 px-6 rounded-full text-sm hover:bg-green-700"
      >
        Enter Garden Area Manually
      </button>
    </div>
  );
}