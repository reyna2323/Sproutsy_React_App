import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPlantSpacing,
  fetchPlantSuggestions,
  fetchPlantDetails
} from '../utils/plantService';

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#f43f5e', '#0ea5e9'];

export default function CustomizePlot() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [shape, setShape] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    const layout = JSON.parse(localStorage.getItem('plot-final-layout')) || [];
    const manualPlot = JSON.parse(localStorage.getItem('manual-plot')) || {};

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    const xs = manualPlot?.path?.map(p => p.x) || [];
    const ys = manualPlot?.path?.map(p => p.y) || [];

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    const shapeW = maxX - minX;
    const shapeH = maxY - minY;

    const sX = (canvasW - 40) / shapeW;
    const sY = (canvasH - 40) / shapeH;
    const drawScale = Math.min(sX, sY);

    const offsetX = (canvasW - shapeW * drawScale) / 2 - minX * drawScale;
    const offsetY = (canvasH - shapeH * drawScale) / 2 - minY * drawScale;

    setOffset({ x: offsetX, y: offsetY });
    setScale(drawScale);
    setShape(manualPlot);

    const cmap = {};
    layout.forEach((plant, i) => {
      cmap[plant.name] = COLORS[i % COLORS.length];
    });
    setColorMap(cmap);
    setPlants(layout.map(p => ({ ...p, color: cmap[p.name] })));
  }, []);

  useEffect(() => {
    draw();
  }, [plants, shape, scale]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#eee';
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (shape?.path) {
      ctx.beginPath();
      ctx.moveTo(
        shape.path[0].x * scale + offset.x,
        shape.path[0].y * scale + offset.y
      );
      shape.path.slice(1).forEach(p =>
        ctx.lineTo(p.x * scale + offset.x, p.y * scale + offset.y)
      );
      ctx.closePath();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    for (let i = 0; i < plants.length; i++) {
      const p = plants[i];
      const spacing = getPlantSpacing(p.name) * scale;
      const hasConflict = plants.some(
        (other, j) =>
          i !== j &&
          Math.hypot(p.x - other.x, p.y - other.y) < spacing
      );
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = hasConflict ? 'red' : '#333';
      ctx.stroke();
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const idx = plants.findIndex(p => Math.hypot(p.x - x, p.y - y) < 10);
    if (idx !== -1) setDragIndex(idx);
  };

  const handleMouseUp = () => setDragIndex(null);

  const handleMouseMove = (e) => {
    if (dragIndex === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updated = [...plants];
    updated[dragIndex] = { ...updated[dragIndex], x, y };
    setPlants(updated);
  };

  const handleCanvasClick = async (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const p of plants) {
      if (Math.hypot(p.x - x, p.y - y) < 10) {
        const data = await fetchPlantDetails(p.name);
        setSelectedPlant(data);
        return;
      }
    }
    setSelectedPlant(null);
  };

  const handleSearch = async () => {
    if (search.length < 3) return;
    const results = await fetchPlantSuggestions(search);
    setSuggestions(results);
  };

  const handleAddPlant = (name) => {
    const spacing = getPlantSpacing(name);
    const newPlant = {
      name,
      x: 150 + Math.random() * 100,
      y: 150 + Math.random() * 100,
      spacing,
      color: COLORS[(plants.length + 1) % COLORS.length],
    };
    const updated = [...plants, newPlant];
    setPlants(updated);
    setColorMap(prev => ({ ...prev, [name]: newPlant.color }));
    setSearch('');
    setSuggestions([]);
  };

  const handleSave = () => {
    localStorage.setItem('customized-layout', JSON.stringify(plants));
    navigate('/finalize-layout');
  };

  useEffect(() => {
    const timeout = setTimeout(handleSearch, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4">Customize Plot</h1>

      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border mx-auto mb-2 bg-white rounded"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      />

      <input
        type="text"
        placeholder="Search for a plant..."
        className="w-full border rounded px-3 py-2 mb-2"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {suggestions.map((plant, i) => (
        <div
          key={plant.id || plant.common_name || i}
          className="bg-green-100 p-2 rounded mb-1 cursor-pointer"
          onClick={() => handleAddPlant(plant.common_name)}
        >
          {plant.common_name}
        </div>
      ))}

      <div className="text-sm mt-4 mb-2 font-semibold">Legend:</div>
      <ul className="text-sm mb-4">
        {Object.entries(colorMap).map(([name, color]) => (
          <li key={name} className="flex items-center">
            <span
              className="inline-block w-3 h-3 mr-2 rounded-full"
              style={{ background: color }}
            />
            {name}
          </li>
        ))}
      </ul>

      {selectedPlant && (
        <div className="p-4 mb-4 bg-green-50 border rounded">
          <h2 className="font-bold">{selectedPlant.name}</h2>
          <p><strong>Type:</strong> {selectedPlant.type}</p>
          <p><strong>Water:</strong> {selectedPlant.watering}</p>
          <p><strong>Sunlight:</strong> {selectedPlant.sunlight}</p>
          <p><strong>Use:</strong> {selectedPlant.use}</p>
        </div>
      )}

      <button
        onClick={handleSave}
        className="w-full py-2 rounded bg-green-600 text-white text-lg"
      >
        Save
      </button>
    </div>
  );
}