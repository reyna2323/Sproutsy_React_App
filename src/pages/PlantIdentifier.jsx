import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { identifyPlantWithPlantId } from '../utils/api';

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
        name: suggestion?.plant_name || "Unknown Plant",
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
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded w-full max-w-md mb-4"
          />

          <button
            onClick={scanPlant}
            disabled={scanning}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            {scanning ? 'Scanning...' : 'Scan Plant'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <img
            src={plantData.image}
            alt="Scanned Plant"
            className="w-40 h-40 object-cover rounded-full mx-auto mb-4"
          />
          <h2 className="text-lg font-semibold mb-2">{plantData.name}</h2>
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