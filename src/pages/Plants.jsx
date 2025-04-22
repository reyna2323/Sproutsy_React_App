import React, { useState } from "react";

export default function Plants() {
  const [selectedTab, setSelectedTab] = useState("Indoor");
  const [search, setSearch] = useState("");
  const [plants, setPlants] = useState([
    {
      id: 1,
      name: "Basil",
      type: "Herb",
      location: "Kitchen Window",
      waterIn: 8,
      plantedDaysAgo: 12,
      height: "15 cm",
      lastWatered: "2 days ago"
    },
    {
      id: 2,
      name: "Snake Plant",
      type: "Succulent",
      location: "Living Room",
      waterIn: 24,
      plantedDaysAgo: 30,
      height: "40 cm",
      lastWatered: "5 days ago"
    }
  ]);
  const [activePlant, setActivePlant] = useState(null);

  return (
    <div className="p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search your plants..."
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tabs */}
      <div className="flex mb-4">
        {["Indoor", "Outdoor", "Plans"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 p-2 ${
              selectedTab === tab ? "bg-green-300" : "bg-gray-200"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Indoor Plant List */}
      {selectedTab === "Indoor" && (
        <div className="space-y-3">
          {plants
            .filter((plant) =>
              plant.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((plant) => (
              <div
                key={plant.id}
                className="flex justify-between items-center p-3 border rounded shadow-sm"
              >
                <div>
                  <div className="font-semibold">{plant.name} <span
                    className="cursor-pointer ml-1 text-gray-500"
                    onClick={() => setActivePlant(plant)}
                  >ℹ️</span></div>
                  <div className="text-sm text-gray-600">{plant.type}</div>
                </div>
                <div className="text-right text-sm">
                  <div>{plant.location}</div>
                  <div>💧 In {plant.waterIn} hrs</div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Bottom Sheet Pop-up */}
      {activePlant && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t rounded-t-xl">
          <div className="flex justify-between mb-2">
            <strong>{activePlant.name}</strong>
            <button onClick={() => setActivePlant(null)}>✖️</button>
          </div>
          <p className="text-sm mb-1">🌿 Type: {activePlant.type}</p>
          <p className="text-sm mb-1">📍 Location: {activePlant.location}</p>
          <p className="text-sm mb-3">🌱 Planted {activePlant.plantedDaysAgo} days ago</p>

          <div className="flex justify-between items-center mb-2">
            <div>
              📏 Height: {activePlant.height}
              <button className="ml-2 text-blue-500 text-sm">Update</button>
            </div>
            <div>
              💧 Last watered: {activePlant.lastWatered}
              <button className="ml-2 text-blue-500 text-sm">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}