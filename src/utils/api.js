// ⛔ Move these keys to .env in production!
const PERENUAL_API_KEY = "sk-6MvP68182f10946ed10233";
const OPEN_WEATHER_API_KEY = "dece48e32b2d1335542ed99417bc254a";
const PLANT_ID_API_KEY = "oClMzovzvH5tuE1pDc9LhpAVwEtTQNdvnzchbBBgESspdWOtjD";
const OPENCAGE_API_KEY = "593fdfd81f964e6da1ce30bba6bff0ff";
const TREFLE_TOKEN = "YlMsxdp7DCvX3KDoxR2-pIhNznEu3e-E5Rskvlui8HA";

// 🌿 PERENUAL: Search for plants
export async function searchPlants(query) {
  try {
    const res = await fetch(`https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${query}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("searchPlants error:", err);
    return [];
  }
}

// 🌿 PERENUAL: Get full plant details
export async function getPlantDetails(id) {
  try {
    const res = await fetch(`https://perenual.com/api/species/details/${id}?key=${PERENUAL_API_KEY}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("getPlantDetails error:", err);
    return null;
  }
}

// 📷 PERENUAL: Identify plant from image
export async function identifyPlant(imageFile) {
  try {
    const formData = new FormData();
    formData.append("images", imageFile);

    const res = await fetch(`https://perenual.com/api/identify?key=${PERENUAL_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("identifyPlant error:", err);
    return null;
  }
}

// 📷 PLANT.ID: Identify plant with base64 (handle rate limits + invalid JSON)
export async function identifyPlantWithPlantId(base64Image) {
  try {
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

    if (!res.ok) {
      const text = await res.text(); // fallback if not JSON
      throw new Error(`Plant ID API error (${res.status}): ${text}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("identifyPlantWithPlantId error:", err.message);
    return null;
  }
}

// 🌤️ WEATHER: Get current weather
export async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
    );
    return await res.json();
  } catch (err) {
    console.error("getWeather error:", err);
    return null;
  }
}

// 🌍 OPENCAGE: Get city name from coordinates
export async function getCityFromCoords(lat, lon) {
  try {
    const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`);
    const data = await res.json();
    return data.results?.[0]?.components?.city || "Unknown";
  } catch (err) {
    console.error("getCityFromCoords error:", err);
    return "Unknown";
  }
}

// 🌱 TREFLE: Alternative plant database search
export async function searchTreflePlants(query) {
  try {
    const res = await fetch(`https://trefle.io/api/v1/plants/search?token=${TREFLE_TOKEN}&q=${query}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("searchTreflePlants error:", err);
    return [];
  }
}

// 🧪 MOCK: Layout generator
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

// 🔎 EXPLORE: Search (debounced elsewhere)
export async function fetchPlantsFromPerenual(query) {
  try {
    const res = await fetch(`https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${query}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("fetchPlantsFromPerenual error:", err);
    return [];
  }
}

// 🌟 HOMEPAGE: Default recs for indoor/outdoor
export async function fetchDefaultRecommendations() {
  try {
    const [indoorRes, outdoorRes] = await Promise.all([
      fetch(`https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&indoor=1`),
      fetch(`https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&indoor=0`)
    ]);
    const indoorData = await indoorRes.json();
    const outdoorData = await outdoorRes.json();
    return {
      indoor: indoorData.data.slice(0, 2),
      outdoor: outdoorData.data.slice(0, 2),
    };
  } catch (err) {
    console.error("fetchDefaultRecommendations error:", err);
    return { indoor: [], outdoor: [] };
  }
}