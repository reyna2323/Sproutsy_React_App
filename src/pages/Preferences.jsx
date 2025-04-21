import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Preferences() {
  const [experience, setExperience] = useState('Beginner');
  const [location, setLocation] = useState('Both');
  const navigate = useNavigate();

  const handleSave = () => {
    const prefs = {
      experience,
      location,
    };
    localStorage.setItem('sproutsy-preferences', JSON.stringify(prefs));
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">Set Your Gardening Preferences</h1>

      <div className="mb-6 w-full">
        <label className="block mb-2 text-lg font-medium">Gardening Experience</label>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      <div className="mb-6 w-full">
        <label className="block mb-2 text-lg font-medium">Planting Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Both">Both</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-6 py-2 rounded text-lg"
      >
        Save & Continue
      </button>
    </div>
  );
}