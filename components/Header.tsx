import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LogoutIcon, MenuIcon } from './icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { currentUser, logout } = useAppContext();

  if (!currentUser) return null;

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center relative z-10">
      <div className="flex items-center">
         <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-slate-600 hover:bg-slate-100 md:hidden mr-3"
          title="Open Menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Entry Solutions</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-semibold text-slate-700">{currentUser.name}</p>
          <p className="text-sm text-slate-500">{currentUser.role}</p>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogoutIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;