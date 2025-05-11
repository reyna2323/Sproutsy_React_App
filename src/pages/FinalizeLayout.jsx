import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FinalizeLayout() {
  const navigate = useNavigate();

  const handleFinish = () => {
    // Optionally store a flag that the user completed a plot
    localStorage.setItem('plot-complete', 'true');
    navigate('/home');
  };

  return (
    <div className="p-6 text-center min-h-screen bg-[#f0fdf4]">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Your Garden Plot is Ready!</h1>
      <p className="text-gray-700 mb-6">
        You’ve successfully planned your garden. You can now track and care for your plants from the Home screen.
      </p>
      <button
        onClick={handleFinish}
        className="bg-green-600 text-white px-6 py-3 rounded-full text-lg shadow-md hover:bg-green-700 transition"
      >
        Finish and Go to Home
      </button>
    </div>
  );
}