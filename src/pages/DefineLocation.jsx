import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DefineLocation() {
  const navigate = useNavigate();
  const [sunlight, setSunlight] = useState('');
  const [watering, setWatering] = useState('');
  const [locationName, setLocationName] = useState('');
  const [pendingPlant, setPendingPlant] = useState(null);

  useEffect(() => {
    const loc = localStorage.getItem('pending-location');
    const plant = localStorage.getItem('pending-plant');
    if (loc) setLocationName(loc);
    if (plant) setPendingPlant(JSON.parse(plant));
  }, []);

  const handleSubmit = () => {
    if (!sunlight || !watering || !pendingPlant) return;

    const enrichedPlant = {
      ...pendingPlant,
      sunlight,
      watering,
    };

    localStorage.setItem('saved-plant', JSON.stringify(enrichedPlant));
    navigate('/plant-saved');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">New Location Setup</h1>
      <p className="text-center mb-6">
        <strong>"{locationName}"</strong> is an unrecognized location.
        <br />
        Give us some input.
      </p>

      {/* Sunlight */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">How much sunlight does this area receive?</h2>
        <div className="flex justify-between">
          <button
            onClick={() => setSunlight('shady')}
            className={`flex-1 mx-1 py-2 rounded ${
              sunlight === 'shady' ? 'bg-green-600 text-white' : 'bg-gray-100'
            }`}
          >
            ☁️ Shady
          </button>
          <button
            onClick={() => setSunlight('partial')}
            className={`flex-1 mx-1 py-2 rounded ${
              sunlight === 'partial' ? 'bg-green-600 text-white' : 'bg-gray-100'
            }`}
          >
            🌤 Partial
          </button>
          <button
            onClick={() => setSunlight('full')}
            className={`flex-1 mx-1 py-2 rounded ${
              sunlight === 'full' ? 'bg-green-600 text-white' : 'bg-gray-100'
            }`}
          >
            ☀️ Full
          </button>
        </div>
      </div>

      {/* Watering */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">How often can you water here?</h2>
        <div className="flex justify-between">
          <button
            onClick={() => setWatering('rarely')}
            className={`flex-1 mx-1 py-2 rounded ${
              watering === 'rarely' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            💧 Rarely
          </button>
          <button
            onClick={() => setWatering('moderate')}
            className={`flex-1 mx-1 py-2 rounded ${
              watering === 'moderate' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            💦 Moderate
          </button>
          <button
            onClick={() => setWatering('frequent')}
            className={`flex-1 mx-1 py-2 rounded ${
              watering === 'frequent' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            🌊 Frequent
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white w-full py-2 rounded"
      >
        Save Location Info
      </button>
    </div>
  );
}