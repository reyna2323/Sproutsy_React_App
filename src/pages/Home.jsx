import React, { useEffect, useState } from 'react';

export default function Home() {
  const [prefs, setPrefs] = useState({});
  const [humidity, setHumidity] = useState(48); // fake value
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem('sproutsy-preferences')) || {};
    setPrefs(savedPrefs);

    // Fake updates (can be generated or fetched later)
    setUpdates([
      { id: 1, type: 'Watering', plant: 'Basil', urgency: 'High' },
      { id: 2, type: 'Height Check', plant: 'Rosemary', urgency: 'Medium' },
    ]);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🌱 Welcome to Sproutsy</h1>

      {/* Tip of the Day */}
      <div className="bg-green-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">🌞 Tip of the Day</h2>
        <p>Water your plants in the morning to prevent mildew and rot!</p>
      </div>

      {/* Indoor / Outdoor Plant Status */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">🪴 Your Plant Setup</h2>
        <ul className="list-disc list-inside">
          {prefs.location === 'Indoor' || prefs.location === 'Both' ? (
            <li>Indoor plants are thriving 🌤️</li>
          ) : null}
          {prefs.location === 'Outdoor' || prefs.location === 'Both' ? (
            <li>Outdoor plants are soaking up the sun ☀️</li>
          ) : null}
        </ul>
      </div>

      {/* Humidity Widget */}
      <div className="bg-blue-100 p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">💧 Current Humidity</h2>
        <p>{humidity}% (ideal for most herbs and leafy plants)</p>
      </div>

      {/* Updates */}
      <div>
        <h2 className="font-semibold mb-2">🚨 Plant Updates</h2>
        {updates.map((update) => (
          <div key={update.id} className="p-2 border-b">
            <strong>{update.type}</strong> - {update.plant} ({update.urgency})
          </div>
        ))}
      </div>
    </div>
  );
}