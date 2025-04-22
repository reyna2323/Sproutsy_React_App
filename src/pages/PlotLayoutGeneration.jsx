import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Simulating plant spacing API
const plantSpacingAPI = (plantName) => {
  const spacingRules = {
    Tomato: 18,
    Basil: 12,
    Rosemary: 24,
    Lettuce: 12,
  };
  return spacingRules[plantName] || 18;
};

export default function PlotLayoutGeneration({ plotWidth, plotHeight, plants }) {
  const [layout, setLayout] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const generateLayout = () => {
      let plantPositions = [];
      let currentX = 0;
      let currentY = 0;

      // Loop through plants and place them based on spacing
      plants.forEach((plant) => {
        const spacing = plantSpacingAPI(plant);
        if (currentX + spacing <= plotWidth) {
          plantPositions.push({ plant, x: currentX, y: currentY });
          currentX += spacing; // move to the right for the next plant
        } else {
          currentX = 0;
          currentY += spacing; // move down to next row
          plantPositions.push({ plant, x: currentX, y: currentY });
          currentX += spacing; // place next plant in new row
        }
      });

      setLayout(plantPositions);
    };

    generateLayout();
  }, [plants, plotWidth, plotHeight]);

  const handleSave = () => {
    localStorage.setItem('garden-layout', JSON.stringify(layout));
    navigate('/finalize-layout');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Garden Layout</h1>
      <div className="relative w-full h-80 bg-green-100 border border-gray-400 rounded">
        {layout.map((item, index) => (
          <div
            key={index}
            className="absolute bg-green-600 text-white rounded-full flex items-center justify-center"
            style={{
              width: '20px', 
              height: '20px', 
              left: item.x + 'px', 
              top: item.y + 'px',
            }}
          >
            {item.plant}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white w-full py-2 rounded mt-4"
      >
        Save and Continue
      </button>
    </div>
  );
}