import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlantSaved() {
  const navigate = useNavigate();
  const [savedPlant, setSavedPlant] = useState(null);

  useEffect(() => {
    const plant = localStorage.getItem('saved-plant');
    if (plant) {
      setSavedPlant(JSON.parse(plant));
    } else {
      navigate('/home'); // If there's no saved plant, navigate to home
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Hooray! Your plant has been saved.</h1>
  
      {savedPlant ? (
        <div className="flex flex-col items-center">
          {savedPlant.photo && (
            <img
              src={savedPlant.photo}
              alt="Saved Plant"
              className="w-48 h-48 object-cover rounded-full mb-4"
            />
          )}
          <p className="text-lg font-semibold">{savedPlant.name}</p>
          <p className="text-gray-600">{savedPlant.basePlant?.name || 'Unknown type'}</p>
          <p className="text-gray-500">{savedPlant.location}</p>
          <p className="text-gray-500">{savedPlant.height} inches tall</p>
          <div className="mt-4">
            <button
              onClick={() => navigate('/home')}
              className="bg-green-600 text-white py-2 px-6 rounded-full"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <p>Loading saved plant...</p>
      )}
    </div>
  );
}