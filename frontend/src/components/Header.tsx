import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

const Header: React.FC<{ user: any }> = ({ user }) => {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white rounded-b-2xl shadow-sm">
      <div className="text-lg font-semibold text-gray-800">
        Shifter Wealth Management
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">
          Ciao, {user?.name || user?.email?.split('@')[0] || 'Utente'}!
        </span>
        <Button
          onClick={logout}
          variant="danger"
          size="sm"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;