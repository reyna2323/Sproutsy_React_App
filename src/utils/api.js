const PERENUAL_API_KEY = "sk-JOhA6808ea10a64089958";
const OPEN_WEATHER_API_KEY = "dece48e32b2d1335542ed99417bc254a";
const PLANT_ID_API_KEY = "lBxI3hYxPJQXT1fbHBkTg4Cp2D6BZa2UK9uXKeT72GuRdOi7pg";
const OPENCAGE_API_KEY = "593fdfd81f964e6da1ce30bba6bff0ff";
const TREFLE_TOKEN = "YlMsxdp7DCvX3KDoxR2-pIhNznEu3e-E5Rskvlui8HA";

// 🌿 Perenual: Search for plants
export async function searchPlants(query) {
  const res = await fetch(`https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${query}`);
  const data = await res.json();
  return data.data || [];
}

// 🌿 Perenual: Plant details
export async function getPlantDetails(id) {
  const res = await fetch(`https://perenual.com/api/species/details/${id}?key=${PERENUAL_API_KEY}`);
  const data = await res.json();
  return data;
}

// 📷 Perenual: Identify plant from image
export async function identifyPlant(imageFile) {
  const formData = new FormData();
  formData.append("images", imageFile);

  const res = await fetch(`https://perenual.com/api/identify?key=${PERENUAL_API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data;
}

// 📷 Alternative: Plant.id image identification
export async function identifyPlantWithPlantId(base64Image) {
  const res = await fetch("https://api.plant.id/v2/identify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": PLANT_ID_API_KEY,
    },
    body: JSON.stringify({
      images: [base64Image],
      modifiers: ["crops_fast", "similar_images"],
      plant_language: "en",
      plant_details: ["common_names", "url", "wiki_description", "taxonomy"],
    }),
  });

  const data = await res.json();
  return data;
}

// 🌤️ OpenWeatherMap: Current weather
export async function getWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
  );
  const data = await res.json();
  return data;
}

// 🌍 OpenCage: Convert coordinates to city name
export async function getCityFromCoords(lat, lon) {
  const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`);
  const data = await res.json();
  return data.results?.[0]?.components?.city || "Unknown";
}

// 🌱 Trefle: Search plants (alternative plant data)
export async function searchTreflePlants(query) {
  const res = await fetch(`https://trefle.io/api/v1/plants/search?token=${TREFLE_TOKEN}&q=${query}`);
  const data = await res.json();
  return data.data;
}

// 🧪 Mock layout generation for garden planning
export function generateMockLayouts({ area, plants }) {
  return [
    {
      layoutId: 1,
      name: "Sunny Rows",
      plants: plants.map((p, i) => ({ ...p, position: i })),
    },
    {
      layoutId: 2,
      name: "Circle Garden",
      plants: plants.map((p, i) => ({ ...p, position: i + 10 })),
    },
    {
      layoutId: 3,
      name: "Pollinator Patch",
      plants: plants.map((p, i) => ({ ...p, position: i + 20 })),
    },
  ];
}