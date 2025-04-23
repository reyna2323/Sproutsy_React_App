import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/authService';

export default function ResetPrefs() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Sign out from Firebase
    logoutUser();

    // 2. Clear local storage preferences
    localStorage.removeItem('sproutsy-preferences');

    // 3. Navigate to the first screen (login or splash)
    navigate('/');
  }, [navigate]);

  return <p>Resetting Sproutsy...</p>;
}