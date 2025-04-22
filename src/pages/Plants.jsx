import React, { useState } from "react";

export default function Plants() {
  const [selectedTab, setSelectedTab] = useState("Indoor");
  const [search, setSearch] = useState("");
  const [plants, setPlants] = useState([
    {
      id: 1,
      name: "Basil",
      type: "Herb",
      location: "Kitchen",
      waterIn: 23,
      plantedDaysAgo: 8,
      height: "4\"",
      lastWatered: "23 Hours"
    },
    {
      id: 2,
      name: "Mint",
      type: "Herb",
      location: "Kitchen",
      waterIn: 1,
      plantedDaysAgo: 5,
      height: "6\"",
      lastWatered: "20 Hours"
    },
    {
      id: 3,
      name: "Aloe Vera",
      type: "Succulent",
      location: "My Bedroom",
      waterIn: 24,
      plantedDaysAgo: 15,
      height: "12\"",
      lastWatered: "2 Days"
    }
  ]);
  const [activePlant, setActivePlant] = useState(null);

  return (
    <div className="min-h-screen bg-[#0d2b1f] text-white px-4 pt-6 pb-24">
      {/* Search Bar */}
      <div className="flex items-center bg-[#1f3c30] rounded-full px-4 py-2 mb-4">
        <input
          type="text"
          placeholder="Search for plants..."
          className="flex-grow text-white placeholder-white bg-transparent outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="text-white">⚙️</button>
      </div>

      {/* Tabs */}
      <div className="flex justify-between bg-[#1f3c30] p-1 rounded-full mb-4">
        {["Indoor", "Outdoor", "Plans"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 rounded-full text-sm font-medium ${
              selectedTab === tab
                ? "bg-white text-[#0d2b1f]"
                : "text-white"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Plant List */}
      {selectedTab === "Indoor" && (
        <div className="bg-[#1f3c30] rounded-xl p-4 space-y-3">
          <div className="text-sm text-green-300 font-medium mb-2">🌱 Growing now</div>
          {plants
            .filter((plant) =>
              plant.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((plant) => (
              <div
                key={plant.id}
                className="flex justify-between items-center p-3 bg-[#2a4d3c] rounded-lg"
              >
                <div>
                  <div className="font-semibold">
                    {plant.name}
                    <span
                      className="cursor-pointer ml-2 text-gray-300"
                      onClick={() => setActivePlant(plant)}
                    >
                      ℹ️
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">{plant.type}</div>
                </div>
                <div className="text-right text-sm text-gray-300">
                  <div>{plant.location}</div>
                  <div>💧 In {plant.waterIn} hrs</div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Bottom Sheet Pop-up */}
      {activePlant && (
        <div className="fixed bottom-0 left-0 right-0 bg-white text-black rounded-t-2xl p-6 shadow-xl">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          {/* Optional carousel can go here */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{activePlant.name}</h2>
            <p className="text-sm text-gray-600">{activePlant.type}</p>
            <p className="text-sm text-gray-600">{activePlant.location}</p>
            <p className="text-sm text-gray-600">
              Planted {activePlant.plantedDaysAgo} days ago
            </p>
          </div>

          <div className="flex justify-between items-center text-sm mb-3 px-4">
            <div className="flex items-center space-x-2">
              <span>📏</span>
              <span>{activePlant.height}</span>
              <button className="text-green-700 underline text-xs ml-2">Update Height</button>
            </div>
            <div className="flex items-center space-x-2">
              <span>💧</span>
              <span>{activePlant.lastWatered}</span>
              <button className="text-green-700 underline text-xs ml-2">Update</button>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className="text-red-500 font-medium"
              onClick={() => setActivePlant(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}