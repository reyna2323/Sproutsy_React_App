import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const plantInfo = {
  Tomato: {
    name: 'Tomato',
    pronunciation: '/ˈtɑːˌmeɪtoʊ/',
    type: 'Vegetable',
    season: 'Summer',
    sunlight: 'Full sun (6-8 hours daily)',
    watering: 'Keep soil moist, but not soggy.',
    spacing: '18-24 inches apart',
    uses: 'Used in salads, sauces, and more.',
  },
  Basil: {
    name: 'Basil',
    pronunciation: '/ˈbeɪzəl/',
    type: 'Herb',
    season: 'Annual',
    sunlight: 'Full sun',
    watering: 'Moderate watering, keep soil moist',
    spacing: '12-18 inches apart',
    uses: 'Used in pesto, garnishing, and more.',
  },
};

export default function PlantDetail() {
  const { plantName } = useParams();
  const navigate = useNavigate();
  const plant = plantInfo[plantName];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">{plant.name} Details</h1>
      <div>
        <p><strong>Pronunciation:</strong> {plant.pronunciation}</p>
        <p><strong>Type:</strong> {plant.type}</p>
        <p><strong>Season:</strong> {plant.season}</p>
        <p><strong>Sunlight:</strong> {plant.sunlight}</p>
        <p><strong>Watering:</strong> {plant.watering}</p>
        <p><strong>Spacing:</strong> {plant.spacing}</p>
        <p><strong>Uses:</strong> {plant.uses}</p>

        <button
          onClick={() => navigate('/plot-preferences')}
          className="bg-green-600 text-white py-2 px-6 rounded-full mt-4"
        >
          Back to Plot
        </button>
      </div>
    </div>
  );
}