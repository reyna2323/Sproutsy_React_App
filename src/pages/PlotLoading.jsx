import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlantSpacing } from '../utils/plantService';

const COLORS = ['#ff6b6b', '#4ecdc4', '#f7b731', '#a29bfe', '#00cec9', '#e17055'];

export default function PlotLoading() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(0);
  const [colorMap, setColorMap] = useState({});
  const [hoveredPlant, setHoveredPlant] = useState(null);

  useEffect(() => {
    const plot = JSON.parse(localStorage.getItem('manual-plot')) || {};
    const inventory = JSON.parse(localStorage.getItem('plot-inventory')) || [];

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const colorLegend = {};
    inventory.forEach((plant, i) => {
      colorLegend[plant.common_name] = COLORS[i % COLORS.length];
    });
    setColorMap(colorLegend);

    const layoutsGenerated = generateLayouts(plot, inventory, width, height, colorLegend);
    setLayouts(layoutsGenerated);
    drawLayout(ctx, plot, layoutsGenerated[0], colorLegend, setHoveredPlant);
  }, []);

  const handleLayoutChange = (index) => {
    const plot = JSON.parse(localStorage.getItem('manual-plot')) || {};
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawLayout(ctx, plot, layouts[index], colorMap, setHoveredPlant);
    setSelectedLayout(index);
  };

  const handleNext = () => {
    localStorage.setItem('plot-final-layout', JSON.stringify(layouts[selectedLayout]));
    navigate('/plot-layout-view');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-4">Generated Plot Layouts</h1>
      <div className="flex justify-center mb-4 space-x-2">
        {layouts.map((_, i) => (
          <button
            key={i}
            onClick={() => handleLayoutChange(i)}
            className={`px-3 py-1 rounded ${selectedLayout === i ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            Layout {i + 1}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} width={350} height={350} className="mx-auto border rounded mb-4 bg-white" />

      <div className="text-sm mb-4">
        <strong>Legend:</strong>
        <ul className="text-xs mt-1">
          {Object.entries(colorMap).map(([name, color]) => (
            <li key={name} className="flex items-center">
              <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ background: color }}></span>
              {name}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Continue
      </button>

      <PlantPopup plant={hoveredPlant} onClose={() => setHoveredPlant(null)} />
    </div>
  );
}

// ✅ Plant popup modal
function PlantPopup({ plant, onClose }) {
  if (!plant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-80 shadow-xl">
        <h2 className="text-lg font-bold mb-1">{plant.name}</h2>
        <p className="text-sm text-gray-700 mb-3 italic">{plant.scientific_name || '—'}</p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>Spacing:</strong> {plant.spacing} in</li>
          <li><strong>Type:</strong> {plant.type || '—'}</li>
          <li><strong>Sunlight:</strong> {plant.sunlight || '—'}</li>
          <li><strong>Watering:</strong> {plant.watering || '—'}</li>
          <li><strong>Uses:</strong> {plant.uses || '—'}</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-blue-600 underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ✅ Check if point is inside polygon
function isPointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// ✅ Generate plant layouts
function generateLayouts(plot, inventory, canvasWidth, canvasHeight, colorMap) {
  const plantList = inventory.flatMap((plant) =>
    Array.from({ length: plant.quantity }, () => ({
      name: plant.common_name,
      spacing: getPlantSpacing(plant.common_name),
      color: colorMap[plant.common_name],
      scientific_name: plant.scientific_name?.[0] || '—',
      type: plant.type,
      sunlight: plant.sunlight,
      watering: plant.watering,
      uses: plant.uses,
    }))
  );

  const layouts = [];
  const padding = 20;
  const plotShape = getPlotShapeData(plot, canvasWidth, canvasHeight);

  for (let i = 0; i < 3; i++) {
    const placed = [];

    for (const plant of plantList) {
      let tries = 0;
      let x, y;
      while (tries < 300) {
        x = Math.random() * (canvasWidth - 2 * padding) + padding;
        y = Math.random() * (canvasHeight - 2 * padding) + padding;

        const inside = !plotShape.path || isPointInPolygon(x, y, plotShape.path);
        const notTooClose = placed.every(
          (p) => Math.hypot(p.x - x, p.y - y) >= (plant.spacing || 30)
        );

        if (inside && notTooClose) break;
        tries++;
      }

      if (tries < 300) {
        placed.push({ ...plant, x, y });
      }
    }

    layouts.push(placed);
  }

  return layouts;
}

// ✅ Draw layout on canvas
function drawLayout(ctx, plot, layout, colorMap, onClickPlant) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const { path } = getPlotShapeData(plot, ctx.canvas.width, ctx.canvas.height);

  if (path && path.length > 1) {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  layout.forEach((plant) => {
    ctx.beginPath();
    ctx.arc(plant.x, plant.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = plant.color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
  });

  // attach click listener
  ctx.canvas.onclick = (e) => {
    const rect = ctx.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clicked = layout.find((p) => Math.hypot(p.x - x, p.y - y) <= 6);
    if (clicked && onClickPlant) onClickPlant(clicked);
  };
}

// ✅ Return polygon path
function getPlotShapeData(plot, canvasW, canvasH) {
  const padding = 20;

  if (plot.shape === 'Rectangle') {
    const w = plot.width * 10;
    const h = plot.height * 10;
    const x = canvasW / 2 - w / 2;
    const y = canvasH / 2 - h / 2;
    return {
      path: [
        { x, y },
        { x: x + w, y },
        { x: x + w, y: y + h },
        { x, y: y + h },
      ],
    };
  }

  if (plot.shape === 'Square') {
    const s = plot.side * 10;
    const x = canvasW / 2 - s / 2;
    const y = canvasH / 2 - s / 2;
    return {
      path: [
        { x, y },
        { x: x + s, y },
        { x: x + s, y: y + s },
        { x, y: y + s },
      ],
    };
  }

  if (plot.shape === 'Circle') {
    const r = plot.radius * 10;
    const cx = canvasW / 2;
    const cy = canvasH / 2;
    const path = [];
    const segments = 32;
    for (let i = 0; i < segments; i++) {
      const angle = (2 * Math.PI * i) / segments;
      path.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
    return { path };
  }

  if (plot.shape === 'Custom' && plot.path) {
    const raw = plot.path;
    const xs = raw.map((p) => p.x);
    const ys = raw.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const shapeW = maxX - minX;
    const shapeH = maxY - minY;
    const scaleX = (canvasW - 2 * padding) / shapeW;
    const scaleY = (canvasH - 2 * padding) / shapeH;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (canvasW - shapeW * scale) / 2 - minX * scale;
    const offsetY = (canvasH - shapeH * scale) / 2 - minY * scale;

    const transformedPath = raw.map((p) => ({
      x: p.x * scale + offsetX,
      y: p.y * scale + offsetY,
    }));

    return { path: transformedPath };
  }

  return { path: null };
}