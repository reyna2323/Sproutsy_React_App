import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-green-500 p-4 flex justify-between items-center text-white">
      <button onClick={() => navigate('/home')} className="flex flex-col items-center">
        <span className="material-icons">home</span>
        Home
      </button>
      <button onClick={() => navigate('/explore')} className="flex flex-col items-center">
        <span className="material-icons">search</span>
        Explore
      </button>
      <button onClick={() => navigate('/profile')} className="flex flex-col items-center">
        <span className="material-icons">person</span>
        Profile
      </button>
      <button
        onClick={() => navigate('/add-plant')}
        className="flex flex-col items-center justify-center bg-green-700 p-2 rounded-full"
      >
        <span className="material-icons">add</span>
      </button>
    </div>
  );
}