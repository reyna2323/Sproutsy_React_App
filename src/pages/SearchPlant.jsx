import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockPlants = [
  { id: 1, name: 'Snake Plant', isFavorite: false },
  { id: 2, name: 'Spider Plant', isFavorite: true },
  { id: 3, name: 'Peace Lily', isFavorite: false },
];

export default function SearchPlant() {
  const [query, setQuery] = useState('');
  const [filteredPlants, setFilteredPlants] = useState(mockPlants);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setFilteredPlants(
      mockPlants.filter((plant) =>
        plant.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };

  const handleSelectPlant = (plant) => {
    // Mock selection (will be replaced with real logic later)
    alert(`Selected: ${plant.name}`);
    // Proceed to next screen
    navigate('/add-plant-details');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">What plant are you saving today?</h1>
      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search for an indoor plant"
          className="w-full p-2 border rounded"
        />
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-lg cursor-pointer">
          💚 {/* Heart icon (we’ll implement favorites later) */}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg">Search results:</p>
        <ul className="list-none mt-2">
          {filteredPlants.map((plant) => (
            <li
              key={plant.id}
              className="p-2 border-b cursor-pointer"
              onClick={() => handleSelectPlant(plant)}
            >
              {plant.name} {plant.isFavorite && '❤️'}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
      <p
        className="text-blue-500 text-sm underline text-center cursor-pointer mt-4"
        onClick={() => navigate('/plant-identifier')}
        >
        or you can <em>use the plant identifier</em>
      </p>
      </div>
    </div>
  );
}