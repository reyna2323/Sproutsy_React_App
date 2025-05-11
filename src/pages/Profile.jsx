import React, { useState } from 'react';

const tabs = [
  { id: 'account', label: 'Account' },
  { id: 'history', label: 'History' },
  { id: 'settings', label: 'Settings' },
  { id: 'help', label: 'Help' },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-center mb-4">Profile</h1>
      <div className="flex justify-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 border rounded ${
              activeTab === tab.id ? 'bg-green-600 text-white' : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-gray-100 p-4 rounded">
        {activeTab === 'account' && <p>Manage your account details here.</p>}
        {activeTab === 'history' && <p>See your past planted history.</p>}
        {activeTab === 'settings' && <p>Adjust your app preferences.</p>}
        {activeTab === 'help' && <p>Need help? Contact support or read FAQs.</p>}
      </div>
    </div>
  );
}