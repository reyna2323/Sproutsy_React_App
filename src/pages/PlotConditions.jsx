import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sunlightOptions = [
  { id: 'shady', label: 'Shady' },
  { id: 'partial', label: 'Partial Sun' },
  { id: 'full', label: 'Full Sun' },
];

const wateringOptions = [
  { id: 'rarely', label: 'Rarely' },
  { id: 'moderate', label: 'Moderately' },
  { id: 'frequent', label: 'Frequently' },
];

export default function PlotConditions() {
  const [sunlight, setSunlight] = useState('');
  const [watering, setWatering] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    const conditions = { sunlight, watering };
    localStorage.setItem('plot-conditions', JSON.stringify(conditions));
    navigate('/plot-loading');
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-6">Garden Care Insight</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">How much sunlight will this area receive?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sunlightOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSunlight(opt.id)}
              className={`p-3 border rounded text-sm ${
                sunlight === opt.id ? 'bg-yellow-400 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">How often can you water this plot?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {wateringOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setWatering(opt.id)}
              className={`p-3 border rounded text-sm ${
                watering === opt.id ? 'bg-blue-400 text-white' : 'bg-white text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!sunlight || !watering}
        className="mt-4 bg-green-600 text-white py-2 px-6 rounded disabled:opacity-50"
      >
        Generate Layout
      </button>
    </div>
  );
}