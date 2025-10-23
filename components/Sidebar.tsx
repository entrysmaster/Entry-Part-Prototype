import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Role } from '../types';
import { DashboardIcon, PartsIcon, UsersIcon, AnalyticsIcon, AlertsIcon, LogIcon, QRIcon, CameraIcon } from './icons';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
}

const NavLink: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-200 hover:bg-blue-800 hover:text-white'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    <span>{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen }) => {
  const { currentUser } = useAppContext();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === Role.Admin;
  const isManager = currentUser.role === Role.Manager;

  const navItems = [
    { page: 'dashboard', label: 'Dashboard', icon: DashboardIcon, roles: [Role.Admin, Role.Manager] },
    { page: 'parts', label: 'Parts Inventory', icon: PartsIcon, roles: [Role.Admin, Role.Manager, Role.Technician] },
    { page: 'scan', label: 'Scan QR', icon: CameraIcon, roles: [Role.Admin, Role.Technician] },
    { page: 'alerts', label: 'Alerts', icon: AlertsIcon, roles: [Role.Admin, Role.Manager] },
    { page: 'analytics', label: 'Analytics', icon: AnalyticsIcon, roles: [Role.Admin, Role.Manager] },
    { page: 'users', label: 'User Management', icon: UsersIcon, roles: [Role.Admin] },
    { page: 'transactions', label: 'Transaction Log', icon: LogIcon, roles: [Role.Admin, Role.Manager] },
  ];

  return (
    <aside className={`w-64 bg-slate-900 text-white flex flex-col p-4 fixed inset-y-0 left-0 z-30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center mb-8">
        <QRIcon className="w-10 h-10 text-blue-400 mr-2" />
        <span className="text-2xl font-bold">Entry</span>
      </div>
      <nav className="flex-grow space-y-2">
        {navItems.map(item =>
          item.roles.includes(currentUser.role) ? (
            <NavLink
              key={item.page}
              icon={item.icon}
              label={item.label}
              isActive={activePage === item.page}
              onClick={() => setActivePage(item.page)}
            />
          ) : null
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;