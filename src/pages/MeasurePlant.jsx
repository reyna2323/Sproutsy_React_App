import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

export default function MeasurePlant() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [points, setPoints] = useState([]);
  const [height, setHeight] = useState(null);

  const videoConstraints = {
    facingMode: 'environment',
  };

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (points.length < 2) {
      setPoints([...points, { x, y }]);
    }

    if (points.length === 1) {
      const dy = Math.abs(points[0].y - y);
      const estimatedHeight = Math.round((dy / rect.height) * 80); // Assuming 80 inches max height
      setHeight(estimatedHeight);
    }
  };

  const handleConfirm = () => {
    const plantData = localStorage.getItem('pending-plant');
    if (plantData && height) {
      const parsedPlant = JSON.parse(plantData);
      parsedPlant.height = height;
      localStorage.setItem('saved-plant', JSON.stringify(parsedPlant));
      localStorage.setItem('measured-height', height);
      navigate('/add-plant-details');
    }
  };

  const reset = () => {
    setPoints([]);
    setHeight(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Measure Your Plant</h1>

      {!height ? (
        <div className="flex flex-col items-center">
          <div
            onClick={handleClick}
            className="relative w-full max-w-md"
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="rounded w-full"
            />
            {points.map((p, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-green-500 rounded-full"
                style={{ left: p.x - 8, top: p.y - 8 }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Tap the bottom of your plant, then the top to measure.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">
            Your plant's height is approximately <strong>{height} inches</strong>.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleConfirm}
              className="bg-green-600 text-white py-2 px-6 rounded"
            >
              Confirm Height
            </button>
            <button
              onClick={reset}
              className="text-red-500 underline text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* 🛠 NOTE: Replace this with AR-based measurement using ARKit/Viro in React Native later */}
    </div>
  );
}