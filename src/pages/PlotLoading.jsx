import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // ✅ Import navigation module
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Simulating layout data for three garden layouts
const mockLayouts = [
  {
    id: 1,
    plants: ['Tomato', 'Basil', 'Rosemary'],
    image: '/images/layout1.jpg', // Replace with actual diagram images later
  },
  {
    id: 2,
    plants: ['Lettuce', 'Carrot', 'Basil'],
    image: '/images/layout2.jpg', // Replace with actual diagram images later
  },
  {
    id: 3,
    plants: ['Rosemary', 'Tomato', 'Lettuce'],
    image: '/images/layout3.jpg', // Replace with actual diagram images later
  },
];

export default function PlotLoading() {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState(null);

  useEffect(() => {
    const fetchLayouts = () => {
      setTimeout(() => {
        setLayouts(mockLayouts); // Simulate API fetch
      }, 3000);
    };
    fetchLayouts();
  }, []);

  const handleLayoutSelect = (layoutId) => {
    navigate(`/plot-layout-${layoutId}`);
  };

  if (!layouts) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4 text-center">Generating Garden Layouts...</h1>
        <p className="text-center">Please wait while we generate your optimized garden plots.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4 text-center">Choose a Garden Layout</h1>

      <Swiper
        modules={[Navigation]} // ✅ Enable navigation module
        navigation
        spaceBetween={10}
        slidesPerView={1}
        loop
        className="my-4"
      >
        {layouts.map((layout) => (
          <SwiperSlide key={layout.id}>
            <div className="flex flex-col items-center">
              <img
                src={layout.image}
                alt={`Garden layout ${layout.id}`}
                className="w-full h-96 object-cover mb-4"
              />
              <h2 className="font-semibold text-lg mb-2">Layout {layout.id}</h2>
              <p className="text-gray-600">Plants: {layout.plants.join(', ')}</p>
              <button
                onClick={() => handleLayoutSelect(layout.id)}
                className="bg-green-500 text-white py-2 px-6 rounded mt-4"
              >
                Select Layout
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}