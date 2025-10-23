import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Role, User } from '../types';
import Modal from '../components/Modal';

const EditUserRoleModal: React.FC<{ user: User; onSave: (newRole: Role) => void; onCancel: () => void }> = ({ user, onSave, onCancel }) => {
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);

  const handleSave = () => {
    onSave(selectedRole);
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title={`Edit Role for ${user.name}`}>
      <div className="space-y-4">
        <p>Current Role: <span className="font-semibold">{user.role}</span></p>
        <div>
          <label htmlFor="role-select" className="block text-sm font-medium text-slate-700">New Role</label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {Object.values(Role).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">Cancel</button>
        <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
      </div>
    </Modal>
  );
};


const UsersPage: React.FC = () => {
  const { users, updateUserRole } = useAppContext();
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  
  const handleSaveRole = (newRole: Role) => {
    if (editingUser) {
        updateUserRole(editingUser.id, newRole);
        setEditingUser(undefined);
    }
  };


  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">User Management</h1>

      {/* Table for larger screens */}
      <div className="bg-white shadow rounded-lg overflow-x-auto hidden md:block">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Last Sign-In</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === Role.Admin ? 'bg-red-100 text-red-800' :
                    user.role === Role.Manager ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(user.lastSignIn).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => setEditingUser(user)} className="font-medium text-blue-600 hover:underline">Edit Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for mobile screens */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
            {users.map(user => (
                <div key={user.id} className="bg-white rounded-lg shadow p-4 space-y-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-slate-800 pr-2">{user.name}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                            user.role === Role.Admin ? 'bg-red-100 text-red-800' :
                            user.role === Role.Manager ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    <p className="text-xs text-slate-400">Last Sign-in: {new Date(user.lastSignIn).toLocaleString()}</p>
                    <div className="flex justify-end pt-2 border-t mt-2">
                        <button onClick={() => setEditingUser(user)} className="font-medium text-blue-600 hover:underline">Edit Role</button>
                    </div>
                </div>
            ))}
        </div>

      {editingUser && (
        <EditUserRoleModal 
            user={editingUser}
            onSave={handleSaveRole}
            onCancel={() => setEditingUser(undefined)}
        />
      )}
    </div>
  );
};

export default UsersPage;