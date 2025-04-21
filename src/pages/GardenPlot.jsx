import React from 'react';

export default function GardenPlot() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Your Garden Plot</h1>
      <p className="mb-4">Here you can start adding plants to your garden!</p>
      {/* Placeholder for actual garden plotting feature */}
      <button
        onClick={() => alert('Add new plot feature')}
        className="bg-green-500 text-white p-2 rounded"
      >
        Add New Plot
      </button>
    </div>
  );
}