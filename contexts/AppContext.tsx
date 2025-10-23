import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Part, Alert, Transaction, Role, TransactionType } from '../types';
import { USERS, PARTS, ALERTS, TRANSACTIONS } from '../constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  parts: Part[];
  alerts: Alert[];
  transactions: Transaction[];
  login: (userId: string) => void;
  logout: () => void;
  addPart: (part: Omit<Part, 'id' | 'qrCode'>) => void;
  updatePart: (partId: string, updates: Partial<Part>) => void;
  deletePart: (partId: string) => void;
  checkOutPart: (partId: string, quantity: number, userId: string) => void;
  addStock: (partId: string, quantity: number, userId: string) => void;
  updateUserRole: (userId: string, newRole: Role) => void;
  resolveAlert: (alertId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);
  const [parts, setParts] = useState<Part[]>(PARTS);
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);

  useEffect(() => {
    // Check for new alerts whenever parts change
    const newAlerts: Alert[] = [];
    parts.forEach(part => {
        if (part.quantity <= part.reorderThreshold) {
            const existingAlert = alerts.find(a => a.partId === part.id && !a.resolved);
            if (!existingAlert) {
                newAlerts.push({
                    id: `a${Date.now()}${part.id}`,
                    partId: part.id,
                    partName: part.name,
                    message: `Quantity (${part.quantity}) is at or below reorder threshold (${part.reorderThreshold})`,
                    timestamp: new Date().toISOString(),
                    resolved: false,
                });
            }
        }
    });

    if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts]);
    }
  }, [parts]);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
        ...transaction,
        id: `t-${Date.now()}`,
        timestamp: new Date().toISOString(),
    }
    setTransactions(prev => [newTransaction, ...prev]);
  }

  const addPart = (partData: Omit<Part, 'id' | 'qrCode'>) => {
    const newPart: Part = {
      ...partData,
      id: `p-${Date.now()}`,
      qrCode: `part-p-${Date.now()}`,
    };
    setParts(prev => [...prev, newPart]);
    addTransaction({
        partId: newPart.id,
        partName: newPart.name,
        partSku: newPart.sku,
        userId: currentUser!.id,
        userName: currentUser!.name,
        type: TransactionType.CREATE,
        quantityChange: newPart.quantity,
        newQuantity: newPart.quantity,
    });
  };

  const updatePart = (partId: string, updates: Partial<Part>) => {
    let oldPart: Part | undefined;
    setParts(prev =>
      prev.map(p => {
        if (p.id === partId) {
          oldPart = p;
          return { ...p, ...updates };
        }
        return p;
      })
    );
    
    if (oldPart) {
      const updatedPart = { ...oldPart, ...updates };
      addTransaction({
        partId: partId,
        partName: updatedPart.name,
        partSku: updatedPart.sku,
        userId: currentUser!.id,
        userName: currentUser!.name,
        type: TransactionType.UPDATE,
        quantityChange: 0, // No quantity change in a simple update
        newQuantity: updatedPart.quantity
    });
    }
  };

  const deletePart = (partId: string) => {
    setParts(prev => prev.filter(p => p.id !== partId));
  };
  
  const addStock = (partId: string, quantity: number, userId: string) => {
    let newQuantity = 0;
    setParts(prev =>
      prev.map(p => {
        if (p.id === partId) {
          newQuantity = p.quantity + quantity;
          return { ...p, quantity: newQuantity };
        }
        return p;
      })
    );

    const user = users.find(u => u.id === userId);
    const part = parts.find(p => p.id === partId);
    if(user && part) {
        addTransaction({
            partId: partId,
            partName: part.name,
            partSku: part.sku,
            userId: userId,
            userName: user.name,
            type: TransactionType.STOCK_ADD,
            quantityChange: quantity,
            newQuantity: newQuantity
        });
    }
  };

  const checkOutPart = (partId: string, quantity: number, userId: string) => {
    let newQuantity = 0;
    setParts(prev =>
      prev.map(p => {
        if (p.id === partId && p.quantity >= quantity) {
          newQuantity = p.quantity - quantity;
          return { ...p, quantity: newQuantity };
        }
        return p;
      })
    );

    const user = users.find(u => u.id === userId);
    const part = parts.find(p => p.id === partId);
    if(user && part) {
        addTransaction({
            partId: partId,
            partName: part.name,
            partSku: part.sku,
            userId: userId,
            userName: user.name,
            type: TransactionType.CHECK_OUT,
            quantityChange: -quantity,
            newQuantity: newQuantity
        });
    }
  };

  const updateUserRole = (userId: string, newRole: Role) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };


  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        parts,
        alerts,
        transactions,
        login,
        logout,
        addPart,
        updatePart,
        deletePart,
        checkOutPart,
        addStock,
        updateUserRole,
        resolveAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};