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

// src/utils/plantService.js

export function savePlantForUser(plantData, userId) {
  const existingRaw = localStorage.getItem(`user-plants-${userId}`);
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  const updated = [...existing, plantData];
  localStorage.setItem(`user-plants-${userId}`, JSON.stringify(updated));
}