import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculatePlantCapacity } from '../utils/calculatePlantCapacity';

export default function PlotLayoutGeneration() {
  const navigate = useNavigate();
  const [layout, setLayout] = useState([]);
  const [plotSize, setPlotSize] = useState({ width: 0, height: 0 });
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const manual = JSON.parse(localStorage.getItem('manual-plot'));
    const inventory = JSON.parse(localStorage.getItem('plot-inventory')) || [];

    // For simplicity, we assume each plant needs 1.5 feet spacing unless better info exists
    const spacingMap = {
      Tomato: 24,
      Basil: 12,
      Rosemary: 24,
      Lettuce: 12,
      Carrot: 6,
    };

    const width = manual?.width || 10;
    const height = manual?.height || 10;
    setPlotSize({ width, height });

    const layoutSpots = [];
    let x = 0;
    let y = 0;

    inventory.forEach((plantItem) => {
      const spacing = spacingMap[plantItem.name] || 18;
      const count = plantItem.quantity || 1;

      for (let i = 0; i < count; i++) {
        if (x + spacing > width) {
          x = 0;
          y += spacing;
        }
        if (y + spacing > height) break;

        layoutSpots.push({
          name: plantItem.name,
          x: x,
          y: y,
          spacing,
        });

        x += spacing;
      }
    });

    setLayout(layoutSpots);
    setPlants(inventory.map(p => p.name));
  }, []);

  const handleSave = () => {
    localStorage.setItem('garden-layout', JSON.stringify(layout));
    navigate('/plot-layout-view');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Auto-Generated Garden Layout</h1>

      <div className="relative w-full max-w-[350px] h-[350px] mx-auto bg-green-100 border border-gray-300 rounded">
        {layout.map((item, index) => (
          <div
            key={index}
            className="absolute bg-green-700 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center shadow"
            style={{
              left: `${(item.x / plotSize.width) * 100}%`,
              top: `${(item.y / plotSize.height) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {item.name[0]}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600 mb-2">Plants: {plants.join(', ')}</p>
        <button
          onClick={handleSave}
          className="w-full bg-green-600 text-white py-2 rounded text-lg"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}