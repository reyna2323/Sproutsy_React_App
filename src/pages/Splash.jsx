import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signup');
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-green-200 text-3xl font-bold">
      🌱 Sproutsy
    </div>
  );
}