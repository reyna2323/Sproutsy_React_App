const PERENUAL_API_KEY = "YOUR_PERENUAL_API_KEY";
const OPEN_WEATHER_API_KEY = "dece48e32b2d1335542ed99417bc254a";

/* 🌿 Search for plants by name (Explore + Save Plant) */
export async function searchPlants(query) {
  const res = await fetch(
    `https://perenual.com/api/species-list?key=${PERENUAL_API_KEY}&q=${query}`
  );
  const data = await res.json();
  return data.data || [];
}

/* 🌿 Get full plant details by ID */
export async function getPlantDetails(id) {
  const res = await fetch(
    `https://perenual.com/api/species/details/${id}?key=${PERENUAL_API_KEY}`
  );
  const data = await res.json();
  return data;
}

/* 📷 Identify plant from image (camera screen) */
export async function identifyPlant(imageFile) {
  const formData = new FormData();
  formData.append("images", imageFile);

  const res = await fetch(
    `https://perenual.com/api/identify?key=${PERENUAL_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data;
}

/* 🌤️ Get current weather info for a city (used in preferences + care tips) */
export async function getWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
  );
  const data = await res.json();
  return data;
}

/* 📏 Simulate garden layout generation (to replace with real logic later) */
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