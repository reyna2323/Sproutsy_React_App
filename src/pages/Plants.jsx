import React, { useEffect, useState } from 'react';

export default function Plants() {
  const [tab, setTab] = useState('indoor');
  const [indoorPlants, setIndoorPlants] = useState([]);
  const [outdoorPlants, setOutdoorPlants] = useState([]);
  const [plots, setPlots] = useState([]);

  useEffect(() => {
    const indoor = JSON.parse(localStorage.getItem('indoor-plants') || '[]');
    const outdoor = JSON.parse(localStorage.getItem('outdoor-plants') || '[]');
    const savedPlots = JSON.parse(localStorage.getItem('saved-plots') || '[]');

    setIndoorPlants(indoor);
    setOutdoorPlants(outdoor);
    setPlots(savedPlots);
  }, []);

  const renderList = () => {
    const list = tab === 'indoor' ? indoorPlants : tab === 'outdoor' ? outdoorPlants : plots;
    return list.map((item, idx) => (
      <div key={idx} className="p-3 bg-green-100 rounded mb-2 shadow">
        {item.name || `Plot ${idx + 1}`} • {item.type || item.shape}
      </div>
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">My Plants & Plots</h1>
      <div className="flex justify-center mb-4">
        {['indoor', 'outdoor', 'plans'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 border ${tab === t ? 'bg-green-500 text-white' : ''}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {renderList()}
    </div>
  );
}