import React, { createContext, useContext, useState, useEffect, use } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transactions } from '../types/transactions';

const STORAGE_KEY = 'money_manager_transactions';


interface TransactionsContextType {
    transactions: Transactions[];
    addTransactions: (transaction: Transactions) => void;
    deleteTransaction: (id: string) => void;
    isLoading: boolean;
    selectedMonth: number;
    selectedYear: number;
    goToPreviousMonth: () => void;
    goToNextMonth: () => void;
    getTransactionsForMonth: (month: number, year: number) => Transactions[];
}

const TransactionContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transactions[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);

                if (stored !== null){
                    const parsed = JSON.parse(stored) as Transactions[];
                    setTransactions(parsed);
                }else {
                    setTransactions([]);
                }
            } catch (error) {
                console.error('Error loading transactions:', error);
            } finally {
                setIsLoading(false);
            }
            
        };
        
        loadTransactions();
    }, []);

    useEffect(() => {
        if (isLoading) return; 

        const saveTransactions = async () => {
            try {
                const serialized = JSON.stringify(transactions);
                await AsyncStorage.setItem(STORAGE_KEY, serialized); 
            } catch (error) {
                console.error('Error saving transactions:', error);
            }
        };

        saveTransactions();
    }, [transactions]);

    const goToPreviousMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(y => y - 1);
        } else {
            setSelectedMonth(m => m - 1);
        }
    };

    const goToNextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(y => y + 1);
        } else {
            setSelectedMonth(m => m + 1);
        }
    };

    const addTransactions = (transactions: Transactions) => {
        setTransactions((prev) => [transactions, ...prev]);

    };

    const deleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const getTransactionsForMonth = (month: number, year: number): Transactions[] => {
        const explicit = transactions.filter((t) => {
            const date = new Date(t.date);
            return date.getMonth() === month && date.getFullYear() === year;
        });

        const recuringBase = transactions.filter((t) => {
            if (!t.recurring) return false;

            const date = new Date(t.date);
            const transactionTime =  date.getFullYear() * 12 + date.getMonth();
            const viewingTime = year * 12 + month;

            return transactionTime < viewingTime;
        });

        const explicitLabels = explicit.map((t) => t.label);
        const recurringInjected = recuringBase
            .filter((t) => !explicitLabels.includes(t.label))
            .reduce((acc: Transactions[], t) => {
                const exists = acc.find((a) => a.label === t.label);
                if (!exists){
                    acc.push({
                        ...t,
                        id: `${t.id}_${month}_${year}`,
                        date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
                    });
                }
                return acc;             
            }, []);

        return [...explicit, ...recurringInjected];
    };

    return (
        <TransactionContext.Provider value={{ 
                transactions, 
                addTransactions, 
                deleteTransaction,
                isLoading, 
                selectedMonth, 
                selectedYear, 
                goToPreviousMonth, 
                goToNextMonth,
                getTransactionsForMonth
            }}>
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