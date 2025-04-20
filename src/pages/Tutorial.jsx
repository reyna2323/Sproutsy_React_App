import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tutorial() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Tutorial</h1>
      <p className="mb-6">Learn how to use Sproutsy to grow your dream garden.</p>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => navigate('/home')}
      >
        Get Started
      </button>
    </div>
  );
}
