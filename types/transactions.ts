export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
    | 'Food'
    | 'Transport'
    | 'Entertainment'
    | 'Salary'
    | 'Investment'
    | 'Health'
    | 'Other';

export interface Transactions {
    id: string;
    label: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: string; // ISO format : "2026-05-06"
    recurring: boolean;
}

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
    'Food': '#f97316',       
    'Transport': '#6366f1',   
    'Salary': '#22c55e',      
    'Entertainment': '#ec4899', 
    'Health': '#14b8a6',      
    'Investment': '#e3f63b',  
    'Other': '#94a3b8',       
};

export interface TransactionException {
    transactionId: string;
    month: number;
    year: number;
}