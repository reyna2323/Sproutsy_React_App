// utils/calculatePlantCapacity.js

export const calculatePlantCapacity = (width, height, spacing) => {
    const plantsPerRow = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);
    return plantsPerRow * rows;
  };