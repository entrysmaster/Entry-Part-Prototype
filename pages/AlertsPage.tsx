import React, { useMemo, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Role } from '../types';

const AlertsPage: React.FC = () => {
  const { alerts, resolveAlert, currentUser } = useAppContext();
  const [showResolved, setShowResolved] = useState(false);

  const canResolve = currentUser?.role === Role.Admin;

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => showResolved || !alert.resolved)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, showResolved]);

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">System Alerts</h1>
        <label className="flex items-center space-x-2 cursor-pointer self-end sm:self-center">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={() => setShowResolved(prev => !prev)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <span className="text-slate-600">Show Resolved</span>
        </label>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-slate-200">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <li key={alert.id} className={`p-4 flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0 ${alert.resolved ? 'bg-slate-50 text-slate-500' : ''}`}>
                <div>
                  <p className={`font-semibold ${alert.resolved ? 'text-slate-600' : 'text-amber-700'}`}>{alert.partName}</p>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                {!alert.resolved && canResolve && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 w-full sm:w-auto"
                  >
                    Resolve
                  </button>
                )}
                 {alert.resolved && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full self-start sm:self-center">Resolved</span>
                )}
              </li>
            ))
          ) : (
            <li className="p-6 text-center text-slate-500">No alerts to display.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AlertsPage;