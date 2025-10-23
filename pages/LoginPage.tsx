import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { QRIcon } from '../components/icons';

const LoginPage: React.FC = () => {
  const { users, login } = useAppContext();
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      login(selectedUserId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex justify-center mb-6">
          <QRIcon className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Entry Solutions
        </h1>
        <p className="text-center text-slate-500 mb-8">Parts Manager Portal</p>
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="user-select" className="block text-sm font-medium text-slate-700 mb-2">
              Select User Profile
            </label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;