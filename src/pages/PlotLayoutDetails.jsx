import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// These match the mock layouts from PlotLoading
const mockLayouts = [
  {
    id: 1,
    name: "Sunny Rows",
    plants: ['Tomato', 'Basil', 'Rosemary'],
    image: '/images/layout1.jpg',
  },
  {
    id: 2,
    name: "Pollinator Patch",
    plants: ['Lettuce', 'Carrot', 'Basil'],
    image: '/images/layout2.jpg',
  },
  {
    id: 3,
    name: "Circle Garden",
    plants: ['Rosemary', 'Tomato', 'Lettuce'],
    image: '/images/layout3.jpg',
  },
];

export default function PlotLayoutDetails() {
  const [layout, setLayout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedId = localStorage.getItem('selected-layout-id');
    const found = mockLayouts.find((l) => l.id === parseInt(selectedId));
    setLayout(found);
  }, []);

  const handleNext = () => {
    navigate('/finalize-layout');
  };

  if (!layout) {
    return <div className="p-6 text-center">Loading layout details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-4">{layout.name}</h1>

      <img
        src={layout.image}
        alt={layout.name}
        className="w-full h-64 object-cover rounded mb-4"
      />

      <h2 className="text-lg font-semibold mb-2">Included Plants:</h2>
      <ul className="text-sm list-disc list-inside text-gray-700 mb-6">
        {layout.plants.map((plant, idx) => (
          <li key={idx}>{plant}</li>
        ))}
      </ul>

      <button
        onClick={handleNext}
        className="bg-green-600 text-white w-full py-2 rounded text-lg"
      >
        Finalize Garden Plot
      </button>
    </div>
  );
}