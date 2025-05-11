import React, { useEffect, useRef, useState } from 'react';

export default function CustomizePlot() {
  const canvasRef = useRef(null);
  const [plants, setPlants] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const layout = JSON.parse(localStorage.getItem('plot-final-layout')) || [];
    setPlants(layout);
  }, []);

  useEffect(() => {
    if (plants.length > 0) drawCanvas();
  }, [plants]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // grid
    ctx.strokeStyle = '#e5e5e5';
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

    // plant dots
    plants.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#444';
      ctx.stroke();

      ctx.font = '10px sans-serif';
      ctx.fillStyle = 'black';
      ctx.fillText(p.name, p.x + 12, p.y + 4);
    });
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    const i = plants.findIndex(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 10);
    if (i !== -1) {
      setDraggedIndex(i);
      setOffset({ x: pos.x - plants[i].x, y: pos.y - plants[i].y });
    }
  };

  const handleMouseMove = (e) => {
    if (draggedIndex === null) return;
    const pos = getMousePos(e);
    const newX = pos.x - offset.x;
    const newY = pos.y - offset.y;

    const updated = [...plants];
    updated[draggedIndex] = {
      ...updated[draggedIndex],
      x: newX,
      y: newY,
    };

    // spacing check
    const spacing = updated[draggedIndex].spacing || 30;
    const valid = updated.every((p, idx) => {
      if (idx === draggedIndex) return true;
      const d = Math.hypot(p.x - newX, p.y - newY);
      return d >= spacing;
    });

    if (valid) {
      setPlants(updated);
    }
  };

  const handleMouseUp = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    localStorage.setItem('plot-final-layout', JSON.stringify(plants));
    alert('Layout saved!');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Customize Plot</h1>
      <canvas
        ref={canvasRef}
        width={350}
        height={350}
        className="border border-gray-400 rounded mb-4 bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      <button
        onClick={handleSave}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Save and Continue
      </button>
    </div>
  );
}