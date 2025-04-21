import React, { useEffect, useState } from 'react';

const samplePlants = {
  indoor: [
    { id: 1, name: 'Snake Plant', rating: 'Beginner' },
    { id: 2, name: 'Spider Plant', rating: 'Beginner' },
  ],
  outdoor: [
    { id: 3, name: 'Tomato', rating: 'Intermediate' },
    { id: 4, name: 'Lavender', rating: 'Expert' },
  ],
};

export default function Explore() {
  const [prefs, setPrefs] = useState({});
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem('sproutsy-preferences')) || {};
    setPrefs(savedPrefs);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const renderPlantCard = (plant) => (
    <div key={plant.id} className="p-4 border rounded mb-2 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{plant.name}</h3>
        <p className="text-sm text-gray-600">Ease: {plant.rating}</p>
      </div>
      <button onClick={() => toggleFavorite(plant.id)}>
        {favorites.includes(plant.id) ? '💚' : '🤍'}
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔎 Explore Plants</h1>

      {/* Indoor Section */}
      {(prefs.location === 'Indoor' || prefs.location === 'Both') && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">🌿 Indoor Plants</h2>
          {samplePlants.indoor.map(renderPlantCard)}
        </div>
      )}

      {/* Outdoor Section */}
      {(prefs.location === 'Outdoor' || prefs.location === 'Both') && (
        <div>
          <h2 className="text-xl font-semibold mb-2">🌻 Outdoor Plants</h2>
          {samplePlants.outdoor.map(renderPlantCard)}
        </div>
      )}
    </div>
  );
}