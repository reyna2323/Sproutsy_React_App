import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManualPlot() {
  const navigate = useNavigate();
  const [shape, setShape] = useState('rectangle');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [radius, setRadius] = useState('');
  const [customArea, setCustomArea] = useState('');
  const [calculatedArea, setCalculatedArea] = useState(null);

  const calculateArea = () => {
    let area = 0;

    if (shape === 'rectangle' && width && length) {
      area = parseFloat(width) * parseFloat(length);
    } else if (shape === 'circle' && radius) {
      area = Math.PI * Math.pow(parseFloat(radius), 2);
    } else if (shape === 'custom' && customArea) {
      area = parseFloat(customArea);
    }

    setCalculatedArea(Math.round(area));
  };

  const handleNext = () => {
    const areaData = {
      shape,
      area: calculatedArea,
      dimensions: shape === 'rectangle' ? { width, length } :
                  shape === 'circle' ? { radius } :
                  { customArea },
    };

    localStorage.setItem('plot-area', JSON.stringify(areaData));
    navigate('/plot-plants');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Manual Plot Entry</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Garden Shape</label>
        <select
          value={shape}
          onChange={(e) => {
            setShape(e.target.value);
            setCalculatedArea(null);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="custom">Custom (enter area manually)</option>
        </select>
      </div>

      {shape === 'rectangle' && (
        <>
          <input
            type="number"
            placeholder="Width (ft)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="number"
            placeholder="Length (ft)"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </>
      )}

      {shape === 'circle' && (
        <input
          type="number"
          placeholder="Radius (ft)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="w-full p-2 border rounded"
        />
      )}

        {shape === 'custom' && (
        <div className="mt-2 text-center">
            <button
            onClick={() => navigate('/custom-plot')}
            className="text-blue-500 underline"
            >
            Draw custom plot instead
            </button>
        </div>
        )}
      <button
        onClick={calculateArea}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Calculate Area
      </button>

      {calculatedArea && (
        <div className="mt-4 text-center text-green-700 font-medium">
          Estimated Area: {calculatedArea} sq ft
        </div>
      )}

      {calculatedArea && (
        <button
          onClick={handleNext}
          className="mt-6 bg-green-600 text-white w-full py-2 rounded"
        >
          Next: Select Plants
        </button>
      )}
    </div>
  );
}