import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PlotLayoutDetails() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const layoutId = pathname.split('-')[2];
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    // Simulate fetching data based on the layoutId
    const selectedLayout = mockLayouts.find((layout) => layout.id === parseInt(layoutId));
    setLayout(selectedLayout);
  }, [layoutId]);

  const handleFinalization = () => {
    navigate('/finalize-plot');
  };

  if (!layout) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Layout {layout.id} Details</h1>
      <img
        src={layout.image}
        alt={`Garden layout ${layout.id}`}
        className="w-full h-96 object-cover mb-4"
      />
      <h2 className="font-semibold text-lg mb-2">Plants: {layout.plants.join(', ')}</h2>
      <p className="text-gray-600">
        This layout contains {layout.plants.length} plants: {layout.plants.join(', ')}.
      </p>
      <button
        onClick={handleFinalization}
        className="bg-green-500 text-white py-2 px-6 rounded mt-4"
      >
        Finalize Garden Plot
      </button>
    </div>
  );
}