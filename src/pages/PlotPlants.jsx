import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlantsFromPerenual } from '../utils/api';
import { getFavoritePlants } from '../utils/plantService';

export default function PlotPlants() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [inventory, setInventory] = useState({});
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFavoritePlants().then(setFavorites);
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (search.length > 2) {
        const data = await fetchPlantsFromPerenual(search);
        setResults(data.slice(0, 10)); // limit results
      } else {
        setResults([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [search]); // Added 'search' to dependencies

  const addPlant = (plant) => {
    setInventory((prev) => ({
      ...prev,
      [plant.id]: {
        ...plant,
        quantity: prev[plant.id] ? prev[plant.id].quantity + 1 : 1,
      },
    }));
  };

  const handleNext = () => {
    const plantArray = Object.values(inventory);
    localStorage.setItem('plot-inventory', JSON.stringify(plantArray));
    navigate('/plot-preferences');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-4">Search Plants for This Plot</h1>

      <input
        type="text"
        placeholder="Search for a plant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {results.length > 0 && (
        <div className="space-y-2 mb-6">
          {results.map((plant) => (
            <div key={plant.id} className="flex justify-between items-center p-2 border rounded bg-white">
              <div>
                <p className="font-semibold">{plant.common_name}</p>
                <p className="text-sm text-gray-600 italic">{plant.scientific_name?.[0]}</p>
              </div>
              <button
                onClick={() => addPlant(plant)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">Or choose from your favorites</h2>
          <div className="space-y-2 mb-6">
            {favorites.map((plant) => (
              <div key={plant.id} className="flex justify-between items-center p-2 border rounded bg-green-50">
                <div>
                  <p className="font-semibold">{plant.common_name}</p>
                  <p className="text-sm text-gray-600 italic">{plant.scientific_name || '—'}</p>                </div>
                <button
                  onClick={() => addPlant(plant)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {Object.keys(inventory).length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-2">Selected Plants</h2>
          <div className="space-y-2">
            {Object.values(inventory).map((item) => (
              <div key={item.id} className="flex justify-between p-2 bg-green-100 rounded">
                <span>{item.common_name}</span>
                <span className="text-sm">Qty: {item.quantity}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="mt-6 bg-green-600 text-white w-full py-2 rounded text-lg"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}