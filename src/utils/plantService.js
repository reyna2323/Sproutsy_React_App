export function getFavoritePlants() {
  const raw = localStorage.getItem('favorites');
  return Promise.resolve(JSON.parse(raw || '[]'));
}

export async function toggleFavoritePlant(plant) {
  const existing = await getFavoritePlants();
  const exists = existing.some((p) => p.id === plant.id);
  const updated = exists
    ? existing.filter((p) => p.id !== plant.id)
    : [...existing, plant];
  localStorage.setItem('favorites', JSON.stringify(updated));
  return updated;
}

export function savePlantForUser(plantData, userId) {
  const existingRaw = localStorage.getItem(`user-plants-${userId}`);
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  const updated = [...existing, plantData];
  localStorage.setItem(`user-plants-${userId}`, JSON.stringify(updated));
}

export function getPlantSpacing(plant) {
  const defaultSpacing = 18; // inches
  const spacingStr = plant.spacing || plant.spacing_cm || '';

  const inches = parseFloat(spacingStr.toString().split(' ')[0]) || defaultSpacing;
  return inches / 12; // feet
}

export async function fetchPlantSuggestions(query) {
  const response = await fetch(`https://perenual.com/api/species-list?key=sk-6MvP68182f10946ed10233&q=${encodeURIComponent(query)}`);
  const data = await response.json();
  if (data && data.data) {
    return data.data.map(p => ({
      id: p.id,
      common_name: p.common_name
    })).filter(p => p.common_name);
  }
  return [];
}

export async function fetchPlantDetails(commonName) {
  const response = await fetch(`https://perenual.com/api/species-list?key=sk-6MvP68182f10946ed10233&q=${encodeURIComponent(commonName)}`);
  const data = await response.json();
  if (data && data.data && data.data.length > 0) {
    const plant = data.data[0];
    return {
      name: plant.common_name,
      type: plant.type || 'Unknown',
      watering: plant.watering || 'Unknown',
      sunlight: Array.isArray(plant.sunlight) ? plant.sunlight.join(', ') : plant.sunlight || 'Unknown',
      use: plant.use || '—'
    };
  }
  return {
    name: commonName,
    type: 'Unknown',
    watering: 'Unknown',
    sunlight: 'Unknown',
    use: '—'
  };
}