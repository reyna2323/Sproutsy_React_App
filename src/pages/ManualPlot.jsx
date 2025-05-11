import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManualPlotEntry = () => {
  const navigate = useNavigate();
  const [shape, setShape] = useState('Rectangle');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [side, setSide] = useState('');
  const [radius, setRadius] = useState('');
  const [scale, setScale] = useState(5); // pixels per unit
  const [drawingMode, setDrawingMode] = useState('curve'); // 'line' or 'curve'
  const [path, setPath] = useState([]);
  const canvasRef = useRef(null);

  const checkShapeClosure = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy) < 1;
  };

  const isClosed = path.length > 2 && checkShapeClosure(path[0], path[path.length - 1]);

  const calculatePolygonArea = (vertices) => {
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
    }
    return Math.abs(area / 2);
  };

  const handleCanvasClick = (e) => {
    if (shape !== 'Custom') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (isClosed) return;
    if (path.length > 2 && checkShapeClosure(path[0], { x, y })) {
      setPath([...path, path[0]]);
    } else {
      setPath([...path, { x, y }]);
    }
  };

  const handleUndo = () => {
    setPath(prev => prev.slice(0, -1));
  };

  const handleContinue = () => {
    const manualPlot = { shape };

    if (shape === 'Rectangle') {
      manualPlot.width = parseFloat(width) || 0;
      manualPlot.height = parseFloat(height) || 0;
      manualPlot.area = +(manualPlot.width * manualPlot.height).toFixed(2);
    } else if (shape === 'Square') {
      manualPlot.side = parseFloat(side) || 0;
      manualPlot.area = +(manualPlot.side * manualPlot.side).toFixed(2);
    } else if (shape === 'Circle') {
      manualPlot.radius = parseFloat(radius) || 0;
      manualPlot.area = +(Math.PI * manualPlot.radius * manualPlot.radius).toFixed(2);
    } else if (shape === 'Custom') {
      manualPlot.path = path;
      manualPlot.scale = scale;
      manualPlot.drawingMode = drawingMode;
      if (isClosed) {
        const raw = calculatePolygonArea(path);
        manualPlot.area = +(raw * (scale * 0.5) ** 2).toFixed(2);
      }
    }

    localStorage.setItem('manual-plot', JSON.stringify(manualPlot));
    navigate('/next-page');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    const gridSpacing = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Path
    if (path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(path[0].x * scale, path[0].y * scale);
      for (let i = 1; i < path.length; i++) {
        const prev = path[i - 1];
        const curr = path[i];
        if (drawingMode === 'curve') {
          const midX = (prev.x + curr.x) / 2;
          const midY = (prev.y + curr.y) / 2;
          ctx.quadraticCurveTo(prev.x * scale, prev.y * scale, midX * scale, midY * scale);
        } else {
          ctx.lineTo(curr.x * scale, curr.y * scale);
        }
      }
      if (isClosed) ctx.closePath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (isClosed) {
        ctx.fillStyle = 'rgba(0, 128, 0, 0.2)';
        ctx.fill();
      }

      // Anchor points and dimensions
      ctx.fillStyle = 'black';
      ctx.font = '10px sans-serif';
      path.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x * scale, p.y * scale, 4, 0, 2 * Math.PI);
        ctx.fill();

        if (i > 0) {
          const prev = path[i - 1];
          const dx = p.x - prev.x;
          const dy = p.y - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy) * (scale * 0.5); // in feet
          const midX = (p.x + prev.x) / 2 * scale;
          const midY = (p.y + prev.y) / 2 * scale;
          ctx.fillText(`${dist.toFixed(1)} ft`, midX + 4, midY - 4);
        }
      });
    }
  }, [scale, path, drawingMode, isClosed]);

  return (
    <div className="p-4">
      {/* Shape Selector */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Plot shape</label>
        <select
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Rectangle">Rectangle</option>
          <option value="Square">Square</option>
          <option value="Circle">Circle</option>
          <option value="Custom">Custom Shape</option>
        </select>
      </div>

      {/* Drawing Mode */}
      {shape === 'Custom' && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Drawing Mode</label>
          <select
            value={drawingMode}
            onChange={(e) => setDrawingMode(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="line">Straight Lines</option>
            <option value="curve">Curves</option>
          </select>
        </div>
      )}

      {/* Dimensions for known shapes */}
      {shape === 'Rectangle' && (
        <>
          <input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Width" className="w-full border mb-2 p-2" />
          <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height" className="w-full border p-2" />
        </>
      )}
      {shape === 'Square' && (
        <input value={side} onChange={(e) => setSide(e.target.value)} placeholder="Side length" className="w-full border mb-4 p-2" />
      )}
      {shape === 'Circle' && (
        <input value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="Radius" className="w-full border mb-4 p-2" />
      )}

      {/* Canvas for custom shape */}
      {shape === 'Custom' && (
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Draw your custom plot</label>
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onClick={handleCanvasClick}
            className="border border-gray-400 rounded bg-white"
          />
          <div className="mt-2">
            <label className="block text-sm mb-1 text-gray-700">Scale (pixels per unit):</label>
            <input type="range" min="1" max="10" value={scale} onChange={(e) => setScale(+e.target.value)} className="w-full" />
            <p className="text-sm text-gray-600">1 unit = {(scale * 0.5).toFixed(1)} feet</p>
          </div>
          <button
            onClick={handleUndo}
            className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-3 rounded"
          >
            Undo Last Point
          </button>
        </div>
      )}

      {/* Area display */}
      {shape !== 'Custom' && width && height && (
        <div className="mb-4 text-green-700 font-semibold">Area: {areaFromShape(shape, width, height, side, radius)} sq units</div>
      )}
      {shape === 'Custom' && isClosed && (
        <div className="mb-4 text-green-700 font-semibold">
          Area: {(calculatePolygonArea(path) * (scale * 0.5) ** 2).toFixed(2)} square feet
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleContinue}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Continue
      </button>
    </div>
  );
};

const areaFromShape = (shape, width, height, side, radius) => {
  if (shape === 'Rectangle') return ((parseFloat(width) || 0) * (parseFloat(height) || 0)).toFixed(2);
  if (shape === 'Square') return ((parseFloat(side) || 0) ** 2).toFixed(2);
  if (shape === 'Circle') return (Math.PI * (parseFloat(radius) || 0) ** 2).toFixed(2);
  return null;
};

export default ManualPlotEntry;