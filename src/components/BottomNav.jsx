import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlusModal from './PlusModal';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/explore', label: 'Explore', icon: '🔍' },
    {
      label: '',
      icon: '➕',
      isPlus: true,
      onClick: () => setShowModal(true),
    },
    { path: '/plants', label: 'Plants', icon: '🪴' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-between px-4 py-2 z-50">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={
              item.onClick ? item.onClick : () => navigate(item.path)
            }
            className={`flex flex-col items-center text-sm ${
              location.pathname === item.path
                ? 'text-green-600'
                : 'text-gray-500'
            } ${item.isPlus ? 'relative -top-4' : ''}`}
          >
            <div
              className={`${
                item.isPlus
                  ? 'bg-green-500 text-white p-4 rounded-full text-2xl shadow-lg'
                  : 'text-xl'
              }`}
            >
              {item.icon}
            </div>
            {!item.isPlus && <span className="mt-1">{item.label}</span>}
          </button>
        ))}
      </div>

      <PlusModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}