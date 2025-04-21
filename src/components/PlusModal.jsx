import React, { useState } from 'react';

export default function PlusModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);

  const handleLocation = (loc) => {
    setLocation(loc);
    setStep(2);
  };

  const handleAction = (action) => {
    alert(`${action} (${location}) selected!`);
    // You can navigate to real routes here later
    onClose();
    setStep(1);
    setLocation(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 text-center">
        <h2 className="text-xl font-bold mb-4">
          {step === 1 ? 'Where are you planting?' : 'What would you like to do?'}
        </h2>

        {step === 1 ? (
          <>
            <button
              className="bg-green-500 text-white w-full py-2 mb-3 rounded"
              onClick={() => handleLocation('Indoor')}
            >
              Indoor
            </button>
            <button
              className="bg-green-500 text-white w-full py-2 rounded"
              onClick={() => handleLocation('Outdoor')}
            >
              Outdoor
            </button>
          </>
        ) : (
          <>
            {location === 'Indoor' && (
              <>
                <button
                  className="bg-green-500 text-white w-full py-2 mb-3 rounded"
                  onClick={() => handleAction('Find new plant')}
                >
                  Find New Plant
                </button>
                <button
                  className="bg-green-500 text-white w-full py-2 rounded"
                  onClick={() => handleAction('Save new plant')}
                >
                  Save New Plant
                </button>
              </>
            )}
            {location === 'Outdoor' && (
              <>
                <button
                  className="bg-green-500 text-white w-full py-2 mb-3 rounded"
                  onClick={() => handleAction('Plan new plot')}
                >
                  Plan New Plot
                </button>
                <button
                  className="bg-green-500 text-white w-full py-2 rounded"
                  onClick={() => handleAction('Save new plot')}
                >
                  Save New Plot
                </button>
              </>
            )}
          </>
        )}

        <button onClick={onClose} className="text-sm text-gray-500 mt-4 underline">
          Cancel
        </button>
      </div>
    </div>
  );
}