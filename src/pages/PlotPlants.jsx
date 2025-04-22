import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Temporary plant list (we'll use real API later)
const allPlants = [
  { id: 1, name: 'Tomato' },
  { id: 2, name: 'Basil' },
  { id: 3, name: 'Carrot' },
  { id: 4, name: 'Rosemary' },
  { id: 5, name: 'Lettuce' },
];

export default function PlotPlants() {
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState({});
  const navigate = useNavigate();

  const filtered = allPlants.filter((plant) =>
    plant.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <h1 className="text-xl font-bold mb-4 text-center">Search Plants for This Plot</h1>

      <input
        type="text"
        placeholder="Search for a plant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="space-y-2">
        {filtered.map((plant) => (
          <div
            key={plant.id}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
            <span>{plant.name}</span>
            <button
              onClick={() => addPlant(plant)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              +
            </button>
          </div>
        ))}
      </div>

      {Object.keys(inventory).length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-6 mb-2">Selected Plants:</h2>
          <div className="space-y-2">
            {Object.values(inventory).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-green-50 p-2 rounded"
              >
                <span>{item.name}</span>
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