import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FinalizeLayout() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [plants, setPlants] = useState([]);
  const [shape, setShape] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customized-layout')) || [];
    const manualPlot = JSON.parse(localStorage.getItem('manual-plot')) || {};

    setPlants(saved);
    setShape(manualPlot);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    const xs = manualPlot?.path?.map((p) => p.x) || [];
    const ys = manualPlot?.path?.map((p) => p.y) || [];

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

    setScale(drawScale);
    setOffset({ x: offsetX, y: offsetY });
  }, []);

  useEffect(() => {
    drawFinalPlot();
  }, [plants, shape, scale]);

  const drawFinalPlot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
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
    if (shape?.path?.length > 1) {
      ctx.beginPath();
      ctx.moveTo(
        shape.path[0].x * scale + offset.x,
        shape.path[0].y * scale + offset.y
      );
      shape.path.slice(1).forEach((p) => {
        ctx.lineTo(p.x * scale + offset.x, p.y * scale + offset.y);
      });
      ctx.closePath();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw plants
    for (let i = 0; i < plants.length; i++) {
      const p = plants[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = p.color || '#4ecdc4';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.stroke();
    }

    // Dimensions
    const area = shape?.area || 0;
    const widthLabel = (Math.sqrt(area)).toFixed(2) + ' ft';
    const heightLabel = (Math.sqrt(area)).toFixed(2) + ' ft';

    ctx.fillStyle = 'green';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(heightLabel, 10, canvas.height / 2);
    ctx.fillText(widthLabel, canvas.width / 2 - 30, canvas.height - 10);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    const savedPlots = JSON.parse(localStorage.getItem('user-plots') || '[]');
    const updated = [...savedPlots, { name: name.trim(), layout: plants, shape }];
    localStorage.setItem('user-plots', JSON.stringify(updated));
    navigate('/home');
  };

  return (
    <div className="p-6 min-h-screen bg-[#f0fdf4] text-center">
      <h1 className="text-3xl font-bold text-green-800 mb-4">HOORAY!!!</h1>

      <canvas
        ref={canvasRef}
        width={350}
        height={350}
        className="mx-auto border rounded bg-white mb-4"
      />

      <h2 className="text-lg font-semibold text-green-900 mb-2">Name your plot!</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='ex. “Backyard Flower Patio”'
        className="w-full border rounded px-4 py-2 mb-4 text-center"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-green-700 text-white py-3 rounded-full text-lg"
      >
        Continue
      </button>
    </div>
  );
}
