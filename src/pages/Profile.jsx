import React from 'react';
import { LogOut, User, Settings, MapPin, BookOpen, Globe, Info, HelpCircle } from 'lucide-react';

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f9f9f4] text-[#1c3d2f]">
      {/* Header */}
      <div className="bg-cover bg-center p-6" style={{ backgroundImage: "url('/your-leaf-background.jpg')" }}>
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <img src="/placeholder-avatar.png" alt="avatar" className="w-20 h-20 rounded-full" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-green-700">
              ✏️
            </button>
          </div>
          <h2 className="text-black text-xl font-semibold mt-3">Reyna Patel</h2>
          <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full mt-1">BEGINNER</span>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white mt-[-20px] rounded-t-3xl p-6 space-y-4">
        <MenuItem icon={<User size={20} />} label="Account & Security" />
        <MenuItem icon={<Settings size={20} />} label="Settings" />
        <MenuItem icon={<BookOpen size={20} />} label="Planting History" />
        <MenuItem icon={<MapPin size={20} />} label="My Location" />
        <MenuItem icon={<Globe size={20} />} label="Language" />
        <MenuItem icon={<Info size={20} />} label="About" />
        <MenuItem icon={<HelpCircle size={20} />} label="Help Center" />

        {/* Logout Button */}
        <button className="w-full bg-[#1c3d2f] text-white py-3 rounded-xl text-center font-semibold mt-4">
          Logout
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon, label }) {
  return (
    <button className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-100 transition">
      <div className="mr-3 text-green-900">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}