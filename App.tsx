import React, { useState } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PartsListPage from './pages/PartsListPage';
import AlertsPage from './pages/AlertsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UsersPage from './pages/UsersPage';
import TransactionsPage from './pages/TransactionsPage';
import ScanPage from './pages/ScanPage';
import { Role } from './types';

const MainLayout: React.FC = () => {
    const { currentUser } = useAppContext();
    
    const getDefaultPageForRole = (role: Role) => {
        switch(role) {
            case Role.Admin:
            case Role.Manager:
                return 'dashboard';
            case Role.Technician:
                return 'parts';
            default:
                return 'dashboard';
        }
    };

    const [activePage, setActivePage] = useState(getDefaultPageForRole(currentUser!.role));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'parts':
                return <PartsListPage />;
            case 'scan':
                return <ScanPage />;
            case 'alerts':
                return <AlertsPage />;
            case 'analytics':
                return <AnalyticsPage />;
            case 'users':
                return <UsersPage />;
            case 'transactions':
                return <TransactionsPage />;
            default:
                return <DashboardPage />;
        }
    };
    
    const handleSetActivePage = (page: string) => {
        setActivePage(page);
        setIsSidebarOpen(false);
    }

    return (
        <div className="flex h-screen bg-slate-100">
            <Sidebar activePage={activePage} setActivePage={handleSetActivePage} isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
                     {/* Overlay for mobile */}
                    {isSidebarOpen && (
                        <div
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                            aria-hidden="true"
                        ></div>
                    )}
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
    const { currentUser } = useAppContext();
    return currentUser ? <MainLayout /> : <LoginPage />;
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;