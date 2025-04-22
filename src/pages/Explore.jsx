import React from "react";

export default function Explore() {
  return (
    <div className="min-h-screen bg-[#0d2b1f] text-white px-4 pb-20 pt-6">
      {/* Search bar */}
      <div className="flex items-center bg-white rounded-full px-4 py-2 mb-6">
        <input
          type="text"
          placeholder="Search for plants..."
          className="flex-grow text-black outline-none bg-transparent"
        />
        <button className="ml-2">⚙️</button>
      </div>

      {/* Indoor Recommendations */}
      <Section title="Indoor Recommendations" />

      {/* Outdoor Recommendations */}
      <Section title="Outdoor Recommendations" />
    </div>
  );
}

function Section({ title }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <PlantCard key={i} />
        ))}
      </div>
    </div>
  );
}

function PlantCard() {
  return (
    <div className="bg-white rounded-2xl p-3 text-black min-w-[160px] shadow-md">
      <div className="h-24 bg-gray-200 rounded-xl mb-2"></div>
      <h3 className="font-bold text-sm">Plant Name</h3>
      <p className="text-xs text-gray-600">⭐ Ease: 4.5 (100 reviews)</p>
      <p className="text-xs text-gray-600 mb-2">Suitable for “Room”</p>
      <div className="flex justify-between items-center">
        <button>♡</button>
        <button className="text-green-700 text-xl">➔</button>
      </div>
    </div>
  );
}