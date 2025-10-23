
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Alert, Part, Transaction } from '../types';
import { AlertsIcon, PartsIcon, LogIcon } from '../components/icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
            <Icon className="w-8 h-8"/>
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const RecentActivityItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <li className="flex items-center justify-between py-3 border-b last:border-b-0">
        <div>
            <p className="font-medium text-slate-700">{transaction.partName}</p>
            <p className="text-sm text-slate-500">{transaction.userName} - {transaction.type}</p>
        </div>
        <div className={`text-right ${transaction.type === 'Check Out' ? 'text-red-500' : 'text-green-500'}`}>
            <p className="font-bold">{transaction.quantityChange}</p>
            <p className="text-xs text-slate-400">New Qty: {transaction.newQuantity}</p>
        </div>
    </li>
);

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => (
    <li className="py-3 border-b last:border-b-0">
        <p className="font-semibold text-amber-700">{alert.partName}</p>
        <p className="text-sm text-slate-600">{alert.message}</p>
        <p className="text-xs text-slate-400 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
    </li>
);


const DashboardPage: React.FC = () => {
    const { parts, alerts, transactions } = useAppContext();

    const lowStockParts = parts.filter(p => p.quantity <= p.reorderThreshold).length;
    const activeAlerts = alerts.filter(a => !a.resolved);

    return (
        <div className="p-6 bg-slate-50 min-h-full">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Parts" value={parts.length} icon={PartsIcon} />
                <StatCard title="Low Stock Items" value={lowStockParts} icon={AlertsIcon} />
                <StatCard title="Recent Transactions (24h)" value={transactions.filter(t => new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length} icon={LogIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Active Alerts</h2>
                    {activeAlerts.length > 0 ? (
                        <ul className="divide-y divide-slate-200">
                           {activeAlerts.slice(0, 5).map(alert => <AlertItem key={alert.id} alert={alert} />)}
                        </ul>
                    ) : (
                        <p className="text-slate-500">No active alerts. Inventory is healthy.</p>
                    )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Transactions</h2>
                     {transactions.length > 0 ? (
                        <ul className="divide-y divide-slate-200">
                           {transactions.slice(0, 5).map(t => <RecentActivityItem key={t.id} transaction={t} />)}
                        </ul>
                    ) : (
                        <p className="text-slate-500">No transactions recorded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
