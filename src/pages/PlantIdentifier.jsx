import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { identifyPlantWithPlantId } from '../utils/api';

function formatCommonName(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2') // add space between camelCase
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function LoadingShimmer() {
  return (
    <div className="animate-pulse space-y-4 w-full max-w-md">
      <div className="bg-gray-300 h-[300px] w-full rounded-xl" />
      <div className="bg-gray-300 h-4 w-3/4 rounded" />
      <div className="bg-gray-300 h-4 w-1/2 rounded" />
      <div className="bg-gray-300 h-4 w-2/3 rounded" />
    </div>
  );
}

export default function PlantIdentifier() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [plantData, setPlantData] = useState(null);
  const [scanning, setScanning] = useState(false);

  const videoConstraints = {
    facingMode: 'environment',
  };

  const scanPlant = useCallback(async () => {
    setScanning(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      const base64 = imageSrc.split(',')[1];

      const result = await identifyPlantWithPlantId(base64);
      const suggestion = result?.suggestions?.[0];

      const plant = {
        name: formatCommonName(suggestion?.plant_details?.common_names?.[0] || suggestion?.plant_name || "Unknown Plant"),
        scientificName: suggestion?.plant_name || "Unknown",
        type: suggestion?.plant_details?.taxonomy?.genus || "Unknown",
        season: "N/A",
        sunlight: suggestion?.plant_details?.sunlight?.[0] || "Unknown",
        watering: suggestion?.plant_details?.watering || "Unknown",
        uses:
          suggestion?.plant_details?.wiki_description?.value?.split('.')[0] ||
          "No info available",
        image: imageSrc,
      };

      setPlantData(plant);
    } catch (err) {
      console.error("Plant identification failed:", err);
      alert("Sorry, we couldn't identify that plant. Please try again.");
    } finally {
      setScanning(false);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('selected-plant', JSON.stringify(plantData));
    navigate('/add-plant-details');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Plant Identifier</h1>

      {!plantData ? (
        <div className="flex flex-col items-center">
          {scanning ? (
            <LoadingShimmer />
          ) : (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="rounded w-full max-w-md mb-4"
              />

              <button
                onClick={scanPlant}
                className="bg-green-600 text-white py-2 px-4 rounded"
              >
                Scan Plant
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="text-center">
          <img
            src={plantData.image}
            alt="Scanned Plant"
            className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
          />
          <h2 className="text-lg font-semibold mb-1">{plantData.name}</h2>
          <p className="text-sm italic text-gray-500 mb-2">{plantData.scientificName}</p>
          <p>🌿 Type: {plantData.type}</p>
          <p>📅 Season: {plantData.season}</p>
          <p>☀️ Sunlight: {plantData.sunlight}</p>
          <p>💧 Watering: {plantData.watering}</p>
          <p>🪴 Uses: {plantData.uses}</p>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleConfirm}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
            <button
              onClick={() => setPlantData(null)}
              className="text-red-500 underline text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}