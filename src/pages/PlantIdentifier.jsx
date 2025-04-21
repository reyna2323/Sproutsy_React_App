import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

export default function PlantIdentifier() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [plantData, setPlantData] = useState(null);
  const [scanning, setScanning] = useState(false);

  const videoConstraints = {
    facingMode: 'environment',
  };

  const scanPlant = useCallback(() => {
    setScanning(true);
    const imageSrc = webcamRef.current.getScreenshot();
    
    // Simulated plant recognition result
    const mockResult = {
      name: 'Golden Pothos',
      type: 'Indoor Vine',
      season: 'All year',
      sunlight: 'Partial',
      watering: 'Moderate',
      uses: 'Air purification',
      image: imageSrc,
    };

    setTimeout(() => {
      setPlantData(mockResult);
      setScanning(false);
    }, 2000);
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