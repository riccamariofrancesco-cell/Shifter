import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC<{ activeSection: string; setActiveSection: (section: string) => void }> = ({
  activeSection,
  setActiveSection,
}) => {
  const sections = [
    { id: 'accounts', label: 'Conti', icon: '🏦' },
    { id: 'investments', label: 'Investimenti', icon: '📈' },
    { id: 'crypto', label: 'Crypto', icon: '₿' },
    { id: 'account', label: 'Account', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="font-bold text-xl text-gray-800 mb-6">Menù</h2>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg
                ${activeSection === section.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50 text-gray-700'}
              `}
            >
              <span className="mr-3">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;