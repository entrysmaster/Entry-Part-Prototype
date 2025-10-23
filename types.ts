export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  Technician = 'Technician',
}

export enum TransactionType {
  CREATE = 'Create',
  UPDATE = 'Update',
  STOCK_ADD = 'Stock Add',
  CHECK_OUT = 'Check Out',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastSignIn: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  description: string;
  quantity: number;
  reorderThreshold: number;
  location: string;
  category: string;
  qrCode: string;
  imageUrl?: string;
}

export interface Alert {
  id: string;
  partId: string;
  partName: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface Transaction {
  id: string;
  partId: string;
  partName: string;
  partSku: string;
  userId: string;
  userName: string;
  type: TransactionType;
  quantityChange: number;
  newQuantity: number;
  timestamp: string;
}

export interface ForecastResult {
  forecast: {
    daily_avg: number;
    three_month: number;
    six_month: number;
    one_year: number;
  };
  insights: string;
}