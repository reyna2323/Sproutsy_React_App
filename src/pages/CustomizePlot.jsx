import React, { useEffect, useRef, useState } from 'react';
import { getPlantSpacing, fetchPlantSuggestions } from '../utils/plantService';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#ff6b6b', '#4ecdc4', '#f7b731', '#a29bfe', '#00cec9', '#e17055', '#9c88ff'];

export default function CustomizePlot() {
  const canvasRef = useRef(null);
  const [plants, setPlants] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [shapePath, setShapePath] = useState(null);
  const [spacingWarning, setSpacingWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('plot-final-layout')) || [];
    const colorLegend = {};
    saved.forEach((plant, i) => {
      colorLegend[plant.name] = COLORS[i % COLORS.length];
    });
    setColorMap(colorLegend);
    setPlants(saved);
    drawCanvas(saved, shapePath);
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (search.length > 1) {
        const result = await fetchPlantSuggestions(search);
        setSuggestions(result);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const plot = JSON.parse(localStorage.getItem('manual-plot'));
    if (plot && plot.shape === 'Custom' && plot.path) {
      const transformed = transformCustomPath(plot.path);
      setShapePath(transformed);
      drawCanvas(plants, transformed);
    }
  }, [plants]);

  const transformCustomPath = (path) => {
    const canvasW = 350, canvasH = 350, padding = 20;
    const xs = path.map(p => p.x), ys = path.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const shapeW = maxX - minX, shapeH = maxY - minY;
    const scaleX = (canvasW - 2 * padding) / shapeW;
    const scaleY = (canvasH - 2 * padding) / shapeH;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (canvasW - shapeW * scale) / 2 - minX * scale;
    const offsetY = (canvasH - shapeH * scale) / 2 - minY * scale;
    return path.map(p => ({
      x: p.x * scale + offsetX,
      y: p.y * scale + offsetY
    }));
  };

  const drawCanvas = (dots, shape) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
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

    // Draw shape
    if (shape && shape.length > 1) {
      ctx.beginPath();
      ctx.moveTo(shape[0].x, shape[0].y);
      shape.forEach((p, i) => {
        if (i > 0) ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw plants
    dots.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.stroke();
    });
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    for (let i = 0; i < plants.length; i++) {
      const dist = Math.hypot(x - plants[i].x, y - plants[i].y);
      if (dist < 10) {
        setDraggingIndex(i);
        return;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;

    const newPlants = [...plants];
    const moved = { ...newPlants[draggingIndex], x, y };
    newPlants[draggingIndex] = moved;

    const valid = newPlants.every((a, i) =>
      newPlants.every((b, j) =>
        i === j || Math.hypot(a.x - b.x, a.y - b.y) >= (getPlantSpacing(a.name) || 30)
      )
    );

    setSpacingWarning(!valid);
    if (valid) setPlants(newPlants);
    drawCanvas(newPlants, shapePath);
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    for (const p of plants) {
      const dist = Math.hypot(x - p.x, y - p.y);
      if (dist < 10) {
        setSelectedPlant(p);
        return;
      }
    }
    setSelectedPlant(null);
  };

  const handleAddPlant = (plant) => {
    const color = COLORS[(plants.length + 1) % COLORS.length];
    const x = Math.random() * 300 + 25;
    const y = Math.random() * 300 + 25;
    const newPlant = {
      name: plant.common_name || 'Unknown',
      x,
      y,
      spacing: getPlantSpacing(plant.common_name),
      color,
    };
    setPlants((prev) => [...prev, newPlant]);
    setSearch('');
    setSuggestions([]);
  };

  const handleSave = () => {
    localStorage.setItem('customized-layout', JSON.stringify(plants));
    navigate('/finalize-layout');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center mb-4">Customize Plot</h1>

      <canvas
        ref={canvasRef}
        width={350}
        height={350}
        className="border mx-auto mb-4 bg-white rounded"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      />

      {spacingWarning && (
        <div className="text-red-600 text-center font-semibold mb-2">⚠️ Spacing too close!</div>
      )}

      {selectedPlant && (
        <div className="p-4 border bg-green-50 rounded mb-4">
          <p className="font-bold">{selectedPlant.name}</p>
          <p>Spacing: {getPlantSpacing(selectedPlant.name)} px</p>
          <p>Position: ({Math.round(selectedPlant.x)}, {Math.round(selectedPlant.y)})</p>
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a plant..."
        className="w-full border p-2 rounded mb-2"
      />
      {suggestions.length > 0 && (
        <div className="space-y-1 mb-3">
          {suggestions.map((plant) => (
            <div
              key={plant.id || `${plant.common_name}-${Math.random()}`}
              className="flex justify-between bg-green-100 px-2 py-1 rounded cursor-pointer"
              onClick={() => handleAddPlant(plant)}
            >
              <span>{plant.common_name}</span>
              <span className="italic text-xs">{plant.scientific_name?.[0]}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm mb-4">
        <strong>Legend:</strong>
        <ul className="text-xs mt-1">
          {[...new Set(plants.map(p => p.name))].map((name) => (
            <li key={name} className="flex items-center">
              <span
                className="inline-block w-3 h-3 mr-2 rounded-full"
                style={{ background: colorMap[name] || '#ccc' }}
              ></span>
              {name}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-green-600 text-white py-2 rounded text-lg"
      >
        Save
      </button>
    </div>
  );
}