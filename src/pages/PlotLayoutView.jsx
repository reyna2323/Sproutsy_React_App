import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlotLayoutView() {
  const navigate = useNavigate();
  const [plotImage, setPlotImage] = useState(null);
  const [layout, setLayout] = useState([]);
  const [plotSize, setPlotSize] = useState({ width: 10, height: 10 });
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    const img = localStorage.getItem('plot-diagram-image');
    const layoutData = JSON.parse(localStorage.getItem('garden-layout')) || [];
    const manual = JSON.parse(localStorage.getItem('manual-plot'));
    setPlotImage(img);
    setLayout(layoutData);
    if (manual?.width && manual?.height) {
      setPlotSize({ width: manual.width, height: manual.height });
    }
  }, []);

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
  };

  return (
    <div className="relative p-4">
      <h1 className="text-xl font-bold text-center mb-4">Your Garden Plot</h1>

      <div className="relative mx-auto w-[350px] h-[350px] border border-gray-300 rounded overflow-hidden bg-white">
        {plotImage && (
          <img
            src={plotImage}
            alt="Plot"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        {layout.map((plant, i) => (
          <button
            key={i}
            onClick={() => handlePlantClick(plant)}
            className="absolute bg-green-600 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center shadow"
            style={{
              top: `${(plant.y / plotSize.height) * 100}%`,
              left: `${(plant.x / plotSize.width) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {plant.name[0]}
          </button>
        ))}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate('/home')}
          className="bg-green-600 text-white py-2 px-6 rounded"
        >
          Done
        </button>
      </div>

      {/* 🔍 Plant Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-bold mb-2">{selectedPlant.name}</h2>
            <p className="text-sm text-gray-600 mb-4">Spacing: {selectedPlant.spacing} in</p>
            <button
              onClick={() => setSelectedPlant(null)}
              className="mt-2 text-sm text-blue-600 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}