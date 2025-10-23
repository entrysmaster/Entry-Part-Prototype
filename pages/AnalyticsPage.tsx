import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Part, Transaction, TransactionType, ForecastResult } from '../types';
import { getConsumptionForecast } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsPage: React.FC = () => {
    const { parts, transactions } = useAppContext();
    const [selectedPartId, setSelectedPartId] = useState<string>(parts[0]?.id || '');
    const [timePeriod, setTimePeriod] = useState<number>(30);
    const [forecast, setForecast] = useState<ForecastResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleGenerateForecast = async () => {
        if (!selectedPartId) return;
        
        const selectedPart = parts.find(p => p.id === selectedPartId);
        if(!selectedPart) return;

        const partTransactions = transactions.filter(t => t.partId === selectedPartId && t.type === TransactionType.CHECK_OUT);

        if (partTransactions.length < 2) {
             setForecast({
                forecast: { daily_avg: 0, three_month: 0, six_month: 0, one_year: 0 },
                insights: 'Not enough transaction data to generate a forecast.'
            });
            return;
        }

        setIsLoading(true);
        setForecast(null);
        try {
            const result = await getConsumptionForecast(selectedPart.name, partTransactions);
            setForecast(result);
        } catch (error) {
            console.error(error);
             setForecast({
                forecast: { daily_avg: 0, three_month: 0, six_month: 0, one_year: 0 },
                insights: 'An error occurred while generating the forecast.'
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { handleGenerateForecast(); }, [selectedPartId]);


    const usageData = useMemo(() => {
        const data: { [key: string]: number } = {};
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - timePeriod);

        transactions
            .filter(t => {
                const txDate = new Date(t.timestamp);
                return t.partId === selectedPartId && t.type === TransactionType.CHECK_OUT && txDate >= startDate && txDate <= endDate;
            })
            .forEach(t => {
                const dateStr = new Date(t.timestamp).toISOString().split('T')[0];
                data[dateStr] = (data[dateStr] || 0) + -t.quantityChange;
            });

        return Object.entries(data).map(([date, quantity]) => ({ date, quantity })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [selectedPartId, timePeriod, transactions]);
    
    const topUsedParts = useMemo(() => {
        const counts: { [key: string]: { name: string, count: number } } = {};
        transactions
            .filter(t => t.type === TransactionType.CHECK_OUT)
            .forEach(t => {
                if (!counts[t.partId]) {
                    counts[t.partId] = { name: t.partName, count: 0 };
                }
                counts[t.partId].count += -t.quantityChange;
            });
        return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
    }, [transactions]);

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Analytics & Forecasting</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Usage Trends</h2>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                        <select value={selectedPartId} onChange={e => setSelectedPartId(e.target.value)} className="p-2 border rounded-lg w-full sm:w-auto">
                            {parts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                         <select value={timePeriod} onChange={e => setTimePeriod(parseInt(e.target.value))} className="p-2 border rounded-lg w-full sm:w-auto">
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                            <option value={365}>Last Year</option>
                        </select>
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={usageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{fontSize: 12}}/>
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantity" fill="#3b82f6" name="Checked Out" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                     <h2 className="text-xl font-semibold text-slate-800 mb-4">Top Used Parts</h2>
                     <ul>
                        {topUsedParts.map(p => (
                            <li key={p.name} className="flex justify-between py-2 border-b">
                                <span>{p.name}</span>
                                <span className="font-bold">{p.count}</span>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow">
                 <h2 className="text-xl font-semibold text-slate-800 mb-4">Consumption Forecasting</h2>
                 {isLoading && <p className="text-blue-500">Generating forecast with Gemini...</p>}
                 {forecast && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <h3 className="font-bold text-lg mb-2">Projections</h3>
                             <ul className="space-y-2">
                                <li className="flex justify-between p-2 bg-slate-50 rounded"><span>Avg Daily Usage:</span> <span className="font-bold">{forecast.forecast.daily_avg.toFixed(2)}</span></li>
                                <li className="flex justify-between p-2 bg-slate-50 rounded"><span>3 Month Forecast:</span> <span className="font-bold">{forecast.forecast.three_month}</span></li>
                                <li className="flex justify-between p-2 bg-slate-50 rounded"><span>6 Month Forecast:</span> <span className="font-bold">{forecast.forecast.six_month}</span></li>
                                <li className="flex justify-between p-2 bg-slate-50 rounded"><span>1 Year Forecast:</span> <span className="font-bold">{forecast.forecast.one_year}</span></li>
                             </ul>
                        </div>
                         <div>
                            <h3 className="font-bold text-lg mb-2">AI Insights</h3>
                            <p className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">{forecast.insights}</p>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default AnalyticsPage;