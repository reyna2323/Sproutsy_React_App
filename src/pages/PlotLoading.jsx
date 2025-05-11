import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavoritePlants } from '../utils/plantService';

export default function PlotLoading() {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState([]);

  useEffect(() => {
    const inventory = JSON.parse(localStorage.getItem('plot-inventory') || '[]');
    const plot = JSON.parse(localStorage.getItem('manual-plot') || '{}');
    const width = plot.width || plot.side || (plot.radius ? plot.radius * 2 : 10);
    const height = plot.height || plot.side || (plot.radius ? plot.radius * 2 : 10);

    const plantList = inventory.length > 0 ? inventory : [];

    // generate 3 layouts
    const generated = Array.from({ length: 3 }, (_, layoutIndex) => {
      let layoutPlants = [];
      let x = 0;
      let y = 0;
      let rowHeight = 0;

      plantList.forEach((plant, i) => {
        const spacing =
          parseInt(plant?.watering_general_benchmark?.value) ||
          parseInt(plant?.spacing?.minimum) ||
          18; // fallback

        const plantCopy = { ...plant, x, y };
        layoutPlants.push(plantCopy);

        x += spacing;
        rowHeight = Math.max(rowHeight, spacing);

        if (x + spacing > width * 12) {
          x = 0;
          y += rowHeight;
          rowHeight = 0;
        }
      });

      return {
        id: layoutIndex + 1,
        plants: layoutPlants,
      };
    });

    setTimeout(() => {
      setLayouts(generated);
    }, 1000); // simulate loading
  }, []);

  const handleSelect = (layout) => {
    localStorage.setItem('generated-layout', JSON.stringify(layout));
    navigate('/plot-layout-view');
  };

  if (!layouts.length) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-4">Generating Garden Layouts...</h1>
        <p className="text-gray-600">Please wait while we generate your optimized plot.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-xl font-bold text-center mb-4">Choose a Garden Layout</h1>

      {layouts.map((layout) => (
        <div key={layout.id} className="border p-4 rounded shadow-sm bg-white">
          <h2 className="font-semibold mb-2">Layout {layout.id}</h2>
          <div className="relative w-full h-64 bg-green-100 border rounded overflow-hidden">
            {layout.plants.map((plant, idx) => (
              <div
                key={idx}
                className="absolute w-6 h-6 text-[10px] bg-green-600 text-white rounded-full flex items-center justify-center shadow"
                style={{
                  left: `${plant.x}px`,
                  top: `${plant.y}px`,
                }}
              >
                {plant.common_name?.slice(0, 2).toUpperCase() || 'P'}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSelect(layout)}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Select This Layout
          </button>
        </div>
      ))}
    </div>
  );
}