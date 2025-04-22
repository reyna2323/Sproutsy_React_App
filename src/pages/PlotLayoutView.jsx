import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockPlants = [
  {
    id: 1,
    name: 'Rosemary',
    pronunciation: '/ˈrōzˌmerē/',
    type: 'Herb',
    season: 'Perennial',
    sunlight: 'Full sun (6-8 hrs)',
    watering: 'Drought-tolerant',
    spacing: '18-24 in',
    uses: 'Cooking, oils, pest control',
  },
  {
    id: 2,
    name: 'Tomato',
    pronunciation: '/təˈmādō/',
    type: 'Vegetable',
    season: 'Annual',
    sunlight: 'Full sun',
    watering: 'Frequent',
    spacing: '24-36 in',
    uses: 'Salads, sauces, sandwiches',
  },
  {
    id: 3,
    name: 'Basil',
    pronunciation: '/ˈbāzəl/',
    type: 'Herb',
    season: 'Annual',
    sunlight: 'Full sun',
    watering: 'Moderate',
    spacing: '12 in',
    uses: 'Pesto, seasoning',
  },
];

export default function PlotLayoutView() {
  const navigate = useNavigate();
  const [plotImage, setPlotImage] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    const img = localStorage.getItem('plot-diagram-image');
    setPlotImage(img);
  }, []);

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
  };

  return (
    <div className="relative p-4">
      <h1 className="text-xl font-bold text-center mb-4">Your Garden Plot</h1>

      {plotImage && (
        <div className="relative mx-auto w-[350px] h-[350px] border rounded overflow-hidden">
          <img src={plotImage} alt="Plot" className="absolute inset-0 w-full h-full object-cover" />

          {mockPlants.map((plant, i) => (
            <button
              key={plant.id}
              onClick={() => handlePlantClick(plant)}
              className="absolute bg-green-500 text-white rounded-full text-xs px-2 py-1 shadow"
              style={{
                top: `${20 + i * 70}px`,
                left: `${30 + i * 40}px`,
              }}
            >
              {plant.name}
            </button>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate('/home')}
          className="bg-green-600 text-white py-2 px-6 rounded"
        >
          Done
        </button>
      </div>

      {/* Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-2">{selectedPlant.name}</h2>
            <p className="text-sm text-gray-600 italic">{selectedPlant.pronunciation}</p>
            <ul className="text-sm mt-3 space-y-1">
              <li><strong>Type:</strong> {selectedPlant.type}</li>
              <li><strong>Season:</strong> {selectedPlant.season}</li>
              <li><strong>Sunlight:</strong> {selectedPlant.sunlight}</li>
              <li><strong>Watering:</strong> {selectedPlant.watering}</li>
              <li><strong>Spacing:</strong> {selectedPlant.spacing}</li>
              <li><strong>Uses:</strong> {selectedPlant.uses}</li>
            </ul>
            <button
              onClick={() => setSelectedPlant(null)}
              className="mt-4 text-sm text-blue-600 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}