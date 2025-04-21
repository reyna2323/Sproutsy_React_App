import React, { useState } from 'react';

export default function Preferences() {
  const [experience, setExperience] = useState('Beginner');
  const [location, setLocation] = useState('Both');

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Set Your Gardening Preferences</h1>
      
      <div className="mb-4">
        <label className="block text-lg">Gardening Experience</label>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-lg">Planting Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Both">Both</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
        </select>
      </div>

      <button
        onClick={() => alert('Preferences saved!')}
        className="bg-green-500 text-white p-2 rounded"
      >
        Save Preferences
      </button>
    </div>
  );
}