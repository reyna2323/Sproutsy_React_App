import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'fruits', label: 'Fruits', desc: 'Produce sweet, edible seed-bearing structures.' },
  { id: 'vegetables', label: 'Vegetables', desc: 'Nutritious plants grown for roots, leaves, or stems.' },
  { id: 'herbs', label: 'Herbs', desc: 'Add flavor, attract pollinators, and repel insects.' },
  { id: 'flowers', label: 'Flowers', desc: 'Add beauty and attract pollinators.' },
  { id: 'shrubs', label: 'Shrubs', desc: 'Woody plants that add structure or privacy.' },
  { id: 'trees', label: 'Trees', desc: 'Tall perennials that provide shade or fruit.' },
];

const lifeCycles = [
  { id: 'annual', label: 'Annual', desc: 'Live and die within one season.' },
  { id: 'biennial', label: 'Biennial', desc: 'Grow in year one, bloom in year two.' },
  { id: 'perennial', label: 'Perennial', desc: 'Return year after year once established.' },
];

export default function PlotPreferences() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const toggleSelection = (id, list, setter) => {
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
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-6">Garden Preferences</h1>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">What else would you like to plant?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                toggleSelection(item.id, selectedTypes, setSelectedTypes);
                setDescription(item.desc);
              }}
              className={`p-2 rounded border text-sm ${
                selectedTypes.includes(item.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 mt-6">
        <h2 className="font-semibold mb-2">What life cycles do you prefer?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {lifeCycles.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                toggleSelection(item.id, selectedCycles, setSelectedCycles);
                setDescription(item.desc);
              }}
              className={`p-2 rounded border text-sm ${
                selectedCycles.includes(item.id)
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {description && (
        <div className="bg-yellow-100 text-gray-700 text-sm mt-4 p-3 rounded">
          {description}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={selectedTypes.length === 0 && selectedCycles.length === 0}
        className="mt-6 bg-green-600 text-white py-2 px-6 rounded disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}