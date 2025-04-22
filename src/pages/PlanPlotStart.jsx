import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlanPlotStart() {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-4">Plan New Plot</h1>
      <p className="mb-6 text-gray-700">
        Please use the garden mapping tool to get the area of your garden.
      </p>

      <div className="w-full max-w-md mx-auto h-64 border rounded flex items-center justify-center bg-gray-100 mb-4">
        <p className="text-gray-500">[ AR Camera Placeholder ]</p>
      </div>

      <button
        onClick={() => navigate('/manual-plot')}
        className="text-sm text-blue-600 underline"
      >
        or you can <em>manually enter an area</em>
      </button>
    </div>
  );
}