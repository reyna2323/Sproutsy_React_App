import React from 'react';

export default function TopBar({ title = 'SPROUTSY' }) {
  return (
    <div className="flex justify-between items-center px-4 pt-6 pb-4 bg-[#0d2b1f] text-white">
      <button>☰</button>
      <h1 className="text-xl font-bold">{title}</h1>
      <button>🔔</button>
    </div>
  );
}