import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FinalizeLayout() {
  const navigate = useNavigate();

  const handleFinish = () => {
    // Maybe save the final layout to the server or perform any additional logic.
    navigate('/home'); // Redirect back to the home screen
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-4">Your Garden Layout is Ready!</h1>
      <p>Your garden layout has been successfully generated. You can now proceed with planting!</p>
      <button
        onClick={handleFinish}
        className="bg-green-600 text-white py-2 px-6 rounded-full mt-4"
      >
        Finish and Go to Home
      </button>
    </div>
  );
}