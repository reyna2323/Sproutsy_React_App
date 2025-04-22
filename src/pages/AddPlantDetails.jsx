import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddPlantDetails() {
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [customName, setCustomName] = useState('');
  const [location, setLocation] = useState('');
  const [height, setHeight] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('selected-plant');
    if (saved) {
      setPlant(JSON.parse(saved));
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const knownLocations = ['windowsill', 'kitchen', 'bedroom'];
    const finalPlant = {
      basePlant: plant,
      photo,
      name: customName,
      location,
      height,
    };

    if (!knownLocations.includes(location.toLowerCase())) {
      localStorage.setItem('pending-location', location);
      localStorage.setItem('pending-plant', JSON.stringify(finalPlant));
      navigate('/define-location');
      return;
    }

    localStorage.setItem('saved-plant', JSON.stringify(finalPlant));
    navigate('/plant-saved');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Add Some Details</h1>

      {plant?.name && (
        <p className="mb-4 text-gray-700">
          Saving: <strong>{plant.name}</strong>
        </p>
      )}

      {/* Photo upload */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Plant Photo</label>
        <div className="border rounded w-40 h-40 flex items-center justify-center mb-2">
          {photo ? (
            <img src={photo} alt="Plant" className="w-full h-full object-cover rounded" />
          ) : (
            <span className="text-gray-400">No photo</span>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
      </div>

      {/* Name, Location, Height */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Name Your Plant</label>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Where is it located?</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium mb-1">Height (inches)</label>
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <p
            className="text-blue-500 text-sm mt-1 cursor-pointer"
            onClick={() => navigate('/measure-plant')}
            >
            or you can <em>use our built-in plant measurer</em>
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-600 text-white w-full py-2 rounded text-lg"
      >
        Save Plant
      </button>
    </div>
  );
}