import React, { createContext, useContext, useState } from 'react';
import { Transactions } from '../types/transactions';

interface TransactionsContextType {
    transactions: Transactions[];
    addTransactions: (transaction: Transactions) => void;
}

const TransactionContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transactions[]>([]);

    const addTransactions = (transactions: Transactions) => {
        setTransactions((prev) => [transactions, ...prev]);

    };

    return (
        <TransactionContext.Provider value={{ transactions, addTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionsProvider');
    }
    return context;
}