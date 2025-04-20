import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => navigate('/tutorial')}
      >
        Continue
      </button>
    </div>
  );
}
