import { User, Part, Alert, Transaction, Role, TransactionType } from './types';

const now = new Date();

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'alice@entry.com', role: Role.Admin, lastSignIn: new Date(now.setDate(now.getDate() - 1)).toISOString() },
  { id: 'u2', name: 'Bob Manager', email: 'bob@entry.com', role: Role.Manager, lastSignIn: new Date(now.setHours(now.getHours() - 5)).toISOString() },
  { id: 'u3', name: 'Charlie Tech', email: 'charlie@entry.com', role: Role.Technician, lastSignIn: new Date(now.setMinutes(now.getMinutes() - 20)).toISOString() },
];

export const PARTS: Part[] = [
  { id: 'p1', name: 'M8x25 Hex Bolt', sku: 'HB-M8-25', description: 'Standard M8x25mm hex bolt, zinc plated.', quantity: 150, reorderThreshold: 50, location: 'Aisle 3, Bin 12', category: 'Fasteners', qrCode: 'part-p1', imageUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=Hex+Bolt' },
  { id: 'p2', name: '1/4" Lock Washer', sku: 'LW-025', description: 'Standard 1/4 inch lock washer.', quantity: 45, reorderThreshold: 100, location: 'Aisle 3, Bin 14', category: 'Fasteners', qrCode: 'part-p2', imageUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=Washer' },
  { id: 'p3', name: '24V DC Power Supply', sku: 'PSU-24V-5A', description: '5A 24V DC power supply unit.', quantity: 12, reorderThreshold: 5, location: 'Aisle 7, Shelf 2', category: 'Electronics', qrCode: 'part-p3', imageUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=PSU' },
  { id: 'p4', name: 'Red LED Indicator', sku: 'LED-R-5MM', description: 'Standard 5mm red LED.', quantity: 800, reorderThreshold: 200, location: 'Aisle 7, Bin 3', category: 'Electronics', qrCode: 'part-p4', imageUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=LED' },
];

export const ALERTS: Alert[] = [
  { id: 'a1', partId: 'p2', partName: '1/4" Lock Washer', message: 'Quantity (45) is at or below reorder threshold (100)', timestamp: new Date(now.setHours(now.getHours() - 8)).toISOString(), resolved: false },
];

export const TRANSACTIONS: Transaction[] = [
    { id: 't1', partId: 'p1', partName: 'M8x25 Hex Bolt', partSku: 'HB-M8-25', userId: 'u3', userName: 'Charlie Tech', type: TransactionType.CHECK_OUT, quantityChange: -10, newQuantity: 150, timestamp: new Date(now.setHours(now.getHours() - 2)).toISOString() },
    { id: 't2', partId: 'p4', partName: 'Red LED Indicator', partSku: 'LED-R-5MM', userId: 'u3', userName: 'Charlie Tech', type: TransactionType.CHECK_OUT, quantityChange: -50, newQuantity: 800, timestamp: new Date(now.setHours(now.getHours() - 6)).toISOString() },
    { id: 't3', partId: 'p2', partName: '1/4" Lock Washer', partSku: 'LW-025', userId: 'u1', userName: 'Alice Admin', type: TransactionType.STOCK_ADD, quantityChange: 200, newQuantity: 45, timestamp: new Date(now.setDate(now.getDate() - 2)).toISOString() },
    { id: 't4', partId: 'p3', partName: '24V DC Power Supply', partSku: 'PSU-24V-5A', userId: 'u1', userName: 'Alice Admin', type: TransactionType.CREATE, quantityChange: 12, newQuantity: 12, timestamp: new Date(now.setDate(now.getDate() - 7)).toISOString() },
];