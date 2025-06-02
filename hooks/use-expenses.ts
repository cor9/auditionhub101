import { useState } from "react";
import type { ExpenseData } from "@/types";

interface UseExpensesReturn {
  expenses: ExpenseData[];
  isLoading: boolean;
  error: string | null;
  createExpense: (data: Partial<ExpenseData>) => Promise<void>;
  fetchExpenses: () => Promise<void>;
}

export function useExpenses(): UseExpensesReturn {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExpense = async (data: Partial<ExpenseData>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to create expense");
      
      await fetchExpenses();
    } catch (error) {
      setError("Failed to create expense");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/expenses");
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();
      setExpenses(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch expenses");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    expenses,
    isLoading,
    error,
    createExpense,
    fetchExpenses,
  };
}