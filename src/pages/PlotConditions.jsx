import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sunlightOptions = [
  { id: 'shady', label: 'Shady' },
  { id: 'partial', label: 'Partial Sun' },
  { id: 'full', label: 'Full Sun' },
];

const wateringOptions = [
  { id: 'rarely', label: 'Rarely' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'frequent', label: 'Frequently' },
];

export default function PlotConditions() {
  const [sunlight, setSunlight] = useState('');
  const [watering, setWatering] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    const conditions = {
      sunlight,
      watering,
    };
    localStorage.setItem('plot-conditions', JSON.stringify(conditions));
    navigate('/plot-loading');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Garden Care Insight</h1>

      <h2 className="font-semibold mb-2">How much sunlight will this area receive?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {sunlightOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSunlight(option.id)}
            className={`p-2 border rounded ${
              sunlight === option.id ? 'bg-yellow-400 text-white' : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <h2 className="font-semibold mb-2">How often can you water here?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        {wateringOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setWatering(option.id)}
            className={`p-2 border rounded ${
              watering === option.id ? 'bg-blue-400 text-white' : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!sunlight || !watering}
        className="bg-green-600 text-white w-full py-2 rounded text-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}