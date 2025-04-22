import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'fruits', label: 'Fruits', desc: 'Produce sweet, edible seed-bearing structures.' },
  { id: 'veggies', label: 'Veggies', desc: 'Nutritious edible plants grown for their roots, leaves, or stems.' },
  { id: 'herbs', label: 'Herbs', desc: 'Add flavor, attract pollinators, and repel insects.' },
  { id: 'flowers', label: 'Flowers', desc: 'Brighten gardens, attract pollinators, and add color.' },
  { id: 'shrubs', label: 'Shrubs', desc: 'Woody plants that offer structure and privacy.' },
  { id: 'trees', label: 'Trees', desc: 'Provide shade, fruit, and long-term garden benefits.' },
];

const lifeCycles = [
  { id: 'annual', label: 'Annual', desc: 'Live and die within one season.' },
  { id: 'biennial', label: 'Biennial', desc: 'Grow in year one, bloom in year two, then die.' },
  { id: 'perennial', label: 'Perennial', desc: 'Return year after year once established.' },
];

export default function PlotPreferences() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [description, setDescription] = useState('');

  const toggle = (id, list, setter) => {
    if (list.includes(id)) {
      setter(list.filter((item) => item !== id));
    } else {
      setter([...list, id]);
    }
  };

  const handleNext = () => {
    const preferences = {
      types: selectedTypes,
      cycles: selectedCycles,
    };
    localStorage.setItem('plot-preferences', JSON.stringify(preferences));
    navigate('/plot-conditions');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Garden Preferences</h1>

      <h2 className="font-semibold mb-2">What else would you like to plant?</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {categories.map((item) => (
          <button
            key={item.id}
            className={`p-2 border rounded text-sm ${
              selectedTypes.includes(item.id) ? 'bg-green-500 text-white' : ''
            }`}
            onClick={() => {
              toggle(item.id, selectedTypes, setSelectedTypes);
              setDescription(item.desc);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h2 className="font-semibold mt-6 mb-2">What life cycles do you prefer?</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {lifeCycles.map((item) => (
          <button
            key={item.id}
            className={`p-2 border rounded text-sm ${
              selectedCycles.includes(item.id) ? 'bg-green-500 text-white' : ''
            }`}
            onClick={() => {
              toggle(item.id, selectedCycles, setSelectedCycles);
              setDescription(item.desc);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {description && (
        <div className="text-sm text-gray-700 bg-yellow-100 p-3 rounded mb-4">
          {description}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={selectedTypes.length === 0 && selectedCycles.length === 0}
        className="mt-4 bg-green-600 text-white w-full py-2 rounded text-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}