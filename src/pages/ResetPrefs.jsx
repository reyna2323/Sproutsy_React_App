import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPrefs() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('sproutsy-preferences');
    navigate('/preferences');
  }, [navigate]);

  return <p>Resetting preferences...</p>;
}