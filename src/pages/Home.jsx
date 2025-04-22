import React, { useEffect, useState } from "react";

export default function Home() {
  const [prefs, setPrefs] = useState({});
  const [humidity, setHumidity] = useState(74); // placeholder
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem('sproutsy-preferences')) || {};
    setPrefs(savedPrefs);

    setUpdates([
      {
        id: 1,
        type: 'Watering Due',
        message: '"Backyard Flower Garden" needs to be watered soon!',
        time: '5hr ago',
        urgency: 'High'
      },
      {
        id: 2,
        type: 'Height Check',
        message: 'Dill should be remeasured',
        time: '2 days ago',
        urgency: 'Medium'
      }
    ]);
  }, []);

  return (
    <div className="p-4 font-sans bg-green-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-2">Hello, Reyna 🌿</h1>

      {/* Tip of the Day */}
      <div className="bg-white text-green-900 p-4 rounded-md mb-4">
        <p className="text-sm font-medium">Personalized tip of the day:</p>
        <p className="text-lg font-semibold">Coffee grounds improve daffodil soil quality!</p>
      </div>

      {/* Plant status + humidity */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white text-green-900 p-3 rounded-md">
          <p className="text-sm font-medium">Status</p>
          <p className="text-sm mt-1">🌿 18 healthy plants inside</p>
          <p className="text-sm">🌱 32 healthy plants outside</p>
        </div>
        <div className="bg-white text-green-900 p-3 rounded-md flex flex-col justify-center">
          <p className="text-sm font-medium">💧 Humidity</p>
          <p className="text-xl font-bold">{humidity}%</p>
        </div>
      </div>

      {/* Latest Updates */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Latest Updates</h2>
          <span className="text-sm text-gray-300">Sort by: Urgency: High to Low ⌄</span>
        </div>

        <div className="space-y-3">
          {updates.map(update => (
            <div key={update.id} className="bg-white text-green-900 rounded-md p-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">⚠️ {update.type}</p>
                <p className="text-sm text-gray-500">{update.time}</p>
              </div>
              <p className="text-sm mt-1">{update.message}</p>

              <div className="mt-2">
                {update.type === "Watering Due" ? (
                  <button className="text-green-800 text-sm underline">Update watering status?</button>
                ) : (
                  <button className="text-green-800 text-sm underline">Update height?</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}