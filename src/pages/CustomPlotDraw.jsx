import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CustomPlotDraw() {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [area, setArea] = useState(null);
  const [scale, setScale] = useState(2); // 1 pixel = 2 inches
  const navigate = useNavigate();

  useEffect(() => {
    drawShape(points);
  }, [points]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([...points, { x, y }]);
  };

  const drawShape = (pts) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Grid
    const gridSpacing = 25;
    ctx.strokeStyle = '#eee';
    for (let x = 0; x < canvasRef.current.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasRef.current.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvasRef.current.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasRef.current.width, y);
      ctx.stroke();
    }

    if (pts.length > 0) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(74, 222, 128, 0.2)';
      ctx.fill();

      ctx.fillStyle = '#000';
      pts.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(`${i + 1}`, p.x + 5, p.y - 5);
      });
    }
  };

  const calculateArea = () => {
    if (points.length < 3) return;
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      sum += (points[i].x * points[j].y - points[j].x * points[i].y);
    }
    const pixelArea = Math.abs(sum / 2);
    const inchesArea = pixelArea * Math.pow(scale, 2);
    const sqFeet = inchesArea / 144;
    setArea(sqFeet.toFixed(1));
  };

  const handleSave = () => {
    const plotData = {
      shape: 'custom-drawn',
      points,
      scale,
      area: parseFloat(area),
    };
    localStorage.setItem('plot-area', JSON.stringify(plotData));

    // Save canvas image
    const imageData = canvasRef.current.toDataURL('image/png');
    localStorage.setItem('plot-diagram-image', imageData);

    navigate('/plot-plants');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Draw Your Garden Plot</h1>

      <div className="mb-4 text-sm">
        <label className="block font-medium mb-1">Scale (1 pixel = ? inches)</label>
        <input
          type="number"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        width={350}
        height={350}
        className="border border-gray-300 rounded mx-auto mb-4 cursor-crosshair"
      />

      <div className="flex flex-col gap-2 items-center">
        <button
          onClick={calculateArea}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Calculate Area
        </button>

        {area && (
          <>
            <p className="text-green-700 font-medium">Estimated Area: {area} sq ft</p>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              Save and Continue
            </button>
          </>
        )}

        <button
          onClick={() => {
            setPoints([]);
            setArea(null);
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }}
          className="text-sm text-red-500 underline mt-3"
        >
          Clear Drawing
        </button>
      </div>
    </div>
  );
}