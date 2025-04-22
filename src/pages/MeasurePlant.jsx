import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

export default function MeasurePlant() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [measuring, setMeasuring] = useState(false);
  const [height, setHeight] = useState(null);

  const videoConstraints = {
    facingMode: 'environment',
  };

  const startMeasurement = () => {
    setMeasuring(true);
    // Simulate plant height measurement
    setTimeout(() => {
      const simulatedHeight = Math.floor(Math.random() * (100 - 30 + 1) + 30); // Random height between 30 and 100 inches
      setHeight(simulatedHeight);
      setMeasuring(false);
    }, 2000); // Simulate 2 seconds to measure
  };

  const handleConfirm = () => {
    const plantData = localStorage.getItem('pending-plant');
    if (plantData && height) {
      const parsedPlant = JSON.parse(plantData);
      parsedPlant.height = height;
      localStorage.setItem('saved-plant', JSON.stringify(parsedPlant));
      navigate('/plant-saved');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Measure Your Plant</h1>

      {!height ? (
        <div className="flex flex-col items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded w-full max-w-md mb-4"
          />
          <button
            onClick={startMeasurement}
            disabled={measuring}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            {measuring ? 'Measuring...' : 'Start Measurement'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">
            Your plant's height is approximately <strong>{height} inches</strong>.
          </p>

          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white py-2 px-6 rounded"
          >
            Confirm Height
          </button>
        </div>
      )}
    </div>
  );
}