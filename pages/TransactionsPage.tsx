import React, { useMemo, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Transaction, TransactionType } from '../types';

const TransactionsPage: React.FC = () => {
    const { transactions } = useAppContext();
    const [filterType, setFilterType] = useState<string>('All');

    const filteredTransactions = useMemo(() => {
        if (filterType === 'All') {
            return transactions;
        }
        return transactions.filter(t => t.type === filterType);
    }, [transactions, filterType]);

    const exportToCSV = () => {
        const headers = ['ID', 'Part Name', 'SKU', 'User Name', 'Type', 'Quantity Change', 'New Quantity', 'Timestamp'];
        const rows = filteredTransactions.map(t => [
            t.id,
            `"${t.partName}"`,
            t.partSku,
            t.userName,
            t.type,
            t.quantityChange,
            t.newQuantity,
            new Date(t.timestamp).toLocaleString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-full">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 space-y-4 md:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Transaction Log</h1>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="p-2 border rounded-lg bg-white">
                        <option value="All">All Types</option>
                        {Object.values(TransactionType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button onClick={exportToCSV} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Export CSV</button>
                </div>
            </div>

            {/* Table for larger screens */}
            <div className="bg-white shadow rounded-lg overflow-x-auto hidden md:block">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th className="px-6 py-3">Part Name</th>
                            <th className="px-6 py-3">SKU</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3 text-center">Change</th>
                            <th className="px-6 py-3 text-center">New Qty</th>
                            <th className="px-6 py-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(t => (
                            <tr key={t.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{t.partName}</td>
                                <td className="px-6 py-4 font-mono text-xs">{t.partSku}</td>
                                <td className="px-6 py-4">{t.userName}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        t.type === TransactionType.CHECK_OUT ? 'bg-red-100 text-red-800' :
                                        t.type === TransactionType.STOCK_ADD ? 'bg-green-100 text-green-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-center font-bold ${t.quantityChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {t.quantityChange}
                                </td>
                                <td className="px-6 py-4 text-center">{t.newQuantity}</td>
                                <td className="px-6 py-4">{new Date(t.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards for mobile screens */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredTransactions.map(t => (
                    <div key={t.id} className="bg-white rounded-lg shadow p-4 space-y-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 pr-2">{t.partName}</h3>
                                <p className="font-mono text-xs text-slate-500">{t.partSku}</p>
                            </div>
                            <div className={`flex-shrink-0 font-bold text-xl ${t.quantityChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {t.quantityChange > 0 ? `+${t.quantityChange}` : t.quantityChange}
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">{t.userName}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                t.type === TransactionType.CHECK_OUT ? 'bg-red-100 text-red-800' :
                                t.type === TransactionType.STOCK_ADD ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {t.type}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 pt-1">New Qty: {t.newQuantity}</p>
                        <p className="text-xs text-slate-400 text-right pt-2 border-t mt-2">{new Date(t.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionsPage;