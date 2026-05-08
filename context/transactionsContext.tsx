import React, { createContext, useContext, useState, useEffect, use } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transactions, TransactionException } from '../types/transactions';

const STORAGE_KEY = 'money_manager_transactions';
const EXCEPTIONS_KEY = 'money_manager_exceptions';


interface TransactionsContextType {
    transactions: Transactions[];
    addTransactions: (transaction: Transactions) => void;
    deleteTransaction: (id: string) => void;
    updateTransaction: (transaction: Transactions) => void;
    addException: (exception: TransactionException) => void;
    isLoading: boolean;
    selectedMonth: number;
    selectedYear: number;
    goToPreviousMonth: () => void;
    goToNextMonth: () => void;
    getTransactionsForMonth: (month: number, year: number) => Transactions[];
    exceptions: TransactionException[];
}

const TransactionContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transactions[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [exceptions, setExceptions] = useState<TransactionException[]>([]);

    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    /* LOAD / SAVE TRANSACTIONS */

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

    /* EXCEPTIONS : MODIFY / DELETE */ 

    useEffect(() => {
        const loadExceptions = async () => {
            try {
            const stored = await AsyncStorage.getItem(EXCEPTIONS_KEY);
            if (stored !== null) {
                setExceptions(JSON.parse(stored));
            }
            } catch (error) {
            console.error('Failed to load exceptions :', error);
            }
        };

        loadExceptions();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const saveExceptions = async () => {
            try {
            await AsyncStorage.setItem(EXCEPTIONS_KEY, JSON.stringify(exceptions));
            } catch (error) {
            console.error('Failed to save exceptions :', error);
            }
        };

        saveExceptions();
    }, [exceptions]);

    /* NAVIGATION */

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

    /* TRANSACTIONS MANIPULATION */

    const addTransactions = (transactions: Transactions) => {
        setTransactions((prev) => [transactions, ...prev]);

    };

    const deleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    const updateTransaction = (updated: Transactions) => {
        setTransactions((prev) => prev.map(t => t.id === updated.id ? updated : t));
    };

    const addException = (exceptions: TransactionException) => {
        setExceptions((prev) => [...prev, exceptions]);

        setTransactions((prev) => prev.map(t => t.id === exceptions.transactionId ? { ...t, recurring:false } : t));
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
            .filter((t) => !exceptions.some((e) => e.transactionId === t.id && e.month === month && e.year === year))
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
                updateTransaction,
                addException,
                isLoading, 
                selectedMonth, 
                selectedYear, 
                goToPreviousMonth, 
                goToNextMonth,
                getTransactionsForMonth,
                exceptions
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