import { useState } from "react";
import type { ExpenseData, ExpenseCategory } from "@/types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async (filters?: {
    category?: ExpenseCategory;
    startDate?: Date;
    endDate?: Date;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append("category", filters.category);
      if (filters?.startDate) params.append("startDate", filters.startDate.toISOString());
      if (filters?.endDate) params.append("endDate", filters.endDate.toISOString());

      const response = await fetch(`/api/expenses?${params}`);
      if (!response.ok) throw new Error("Failed to fetch expenses");

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createExpense = async (data: Partial<ExpenseData>) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create expense");

      const newExpense = await response.json();
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      throw err instanceof Error ? err : new Error("An error occurred");
    }
  };

  return {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    createExpense,
  };
}