import React from 'react';

export default function AddPlant() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Plant</h1>
      {/* Simple form to add plant */}
      <form className="flex flex-col">
        <input
          type="text"
          placeholder="Plant Name"
          className="p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Plant Type"
          className="p-2 mb-4 border rounded"
        />
        <button
          onClick={() => alert('Plant added!')}
          className="bg-green-500 text-white p-2 rounded"
        >
          Add Plant
        </button>
      </form>
    </div>
  );
}