// components/PlantRecommendations.jsx

import React, { useEffect, useState } from 'react';
import { fetchPlants } from '../utils/api';
import { calculatePlantCapacity } from '../utils/calculatePlantCapacity';

const PlantRecommendations = ({ plotWidth, plotHeight, userPreferences }) => {
  const [recommendedPlants, setRecommendedPlants] = useState([]);

  useEffect(() => {
    const getRecommendations = async () => {
      const plants = await fetchPlants({
        sunlight: userPreferences.sunlight,
        watering: userPreferences.watering,
        cycle: userPreferences.cycle,
      });

      const suitablePlants = plants.filter((plant) => {
        const spacing = parseInt(plant.spacing) || 12; // default to 12 inches if undefined
        const capacity = calculatePlantCapacity(plotWidth, plotHeight, spacing);
        return capacity >= 1;
      });

      setRecommendedPlants(suitablePlants);
    };

    getRecommendations();
  }, [plotWidth, plotHeight, userPreferences]);

  return (
    <div>
      <h2>Recommended Plants for Your Plot</h2>
      <ul>
        {recommendedPlants.map((plant) => (
          <li key={plant.id}>
            <img src={plant.default_image?.original_url} alt={plant.common_name} width="50" />
            <span>{plant.common_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlantRecommendations;