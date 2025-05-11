import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import {
  fetchPlantsFromPerenual,
  fetchDefaultRecommendations,
  getWeather,
  getCityFromCoords,
  searchTreflePlants,
} from '../utils/api';
import { getFavoritePlants, toggleFavoritePlant } from '../utils/plantService';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [indoorPlants, setIndoorPlants] = useState([]);
  const [outdoorPlants, setOutdoorPlants] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavoritePlants().then(setFavorites);

    async function loadRecommendations() {
      try {
        const { indoor } = await fetchDefaultRecommendations();
        setIndoorPlants(indoor);
      } catch (err) {
        const trefleFallback = await searchTreflePlants('indoor');
        setIndoorPlants(trefleFallback.slice(0, 2));
      }

      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const city = await getCityFromCoords(latitude, longitude);
            const weather = await getWeather(city);
            const isWarm = weather?.main?.temp > 20;

            const res = await fetch(`https://perenual.com/api/species-list?key=sk-6MvP68182f10946ed10233&indoor=0`);
            const data = await res.json();
            const outdoors = isWarm ? data.data : data.data?.slice().reverse();
            setOutdoorPlants(outdoors?.slice(0, 2) || []);
          });
        } else {
          throw new Error('No geolocation');
        }
      } catch (err) {
        const trefleFallback = await searchTreflePlants('outdoor');
        setOutdoorPlants(trefleFallback.slice(0, 2));
      }
    }

    loadRecommendations();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length > 2) {
        let results = await fetchPlantsFromPerenual(query);
        if (!results.length) {
          results = await searchTreflePlants(query);
        }
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);

  const handleFavorite = async (plant) => {
    const updated = await toggleFavoritePlant(plant);
    setFavorites(updated);
  };

  const isFavorited = (id) => favorites.some((f) => f.id === id);

  return (
    <div className="min-h-screen bg-[#0d1d15] text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold tracking-widest">SPROUTSY</h1>
        <div className="bg-white rounded-full text-black p-2 shadow">🔔</div>
      </div>

      <div className="relative flex mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for plants ..."
          className="flex-1 px-4 py-2 rounded-full bg-white text-black placeholder:text-gray-500 shadow"
        />
        <div className="absolute right-3 top-2.5 text-gray-700">⚙️</div>
      </div>

      {searchResults.length > 0 && (
        <Section
          title="Search Results"
          plants={searchResults}
          isFavorited={isFavorited}
          onFavorite={handleFavorite}
        />
      )}

      {indoorPlants.length > 0 && (
        <Section
          title="Indoor Recommendations"
          plants={indoorPlants}
          isFavorited={isFavorited}
          onFavorite={handleFavorite}
        />
      )}

      {outdoorPlants.length > 0 && (
        <Section
          title="Outdoor Recommendations"
          plants={outdoorPlants}
          isFavorited={isFavorited}
          onFavorite={handleFavorite}
        />
      )}
    </div>
  );
}

function Section({ title, plants, isFavorited, onFavorite }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {plants.map((plant) => (
          <PlantCard
            key={plant.id}
            plant={plant}
            isFavorited={isFavorited(plant.id)}
            onFavorite={() => onFavorite(plant)}
          />
        ))}
      </div>
    </div>
  );
}

function PlantCard({ plant, isFavorited, onFavorite }) {
  const image = plant.default_image?.medium_url || plant.image_url || 'https://via.placeholder.com/150';
  const name = plant.common_name || plant.common_name_en || plant.scientific_name || 'Unknown Plant';

  return (
    <div className="w-48 flex-shrink-0 relative bg-white text-black rounded-xl p-2 shadow-md">
      <img
        src={image}
        alt={name}
        className="w-full h-28 object-cover rounded-lg mb-2"
      />
      <button onClick={onFavorite} className="absolute top-2 right-2">
        <Heart className="w-5 h-5 text-green-600" fill={isFavorited ? 'currentColor' : 'none'} />
      </button>
      <h3 className="font-bold text-sm truncate">{name}</h3>
      <p className="text-xs text-gray-600 italic truncate">{plant.scientific_name?.[0] || plant.slug}</p>
      <p className="text-xs text-gray-700">
        Suitable for <span className="font-semibold">“{plant.care_level || 'Any Room'}”</span>
      </p>
      <p className="text-xs text-orange-600 font-semibold mt-1">
        ⭐ Ease: {plant?.watering_general_benchmark?.value || '4.0'} <span className="text-gray-500 text-[10px]">(reviews)</span>
      </p>
    </div>
  );
}