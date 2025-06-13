"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  BanknoteIcon,
  CalendarIcon,
  DollarSignIcon,
  PlusIcon,
  ReceiptIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/components/session-provider";
import Link from "next/link";

// Define types locally since we don't know the types file structure
type ExpenseCategory = 'COACHING' | 'SELF_TAPE_GEAR' | 'TRAVEL' | 'WARDROBE' | 'HEADSHOTS' | 'MEMBERSHIPS' | 'OTHER';

interface ExpenseData {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: Date;
  reimbursable: boolean;
  reimbursed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for demonstration
const mockExpenses: ExpenseData[] = [
  {
    id: "1",
    amount: 75,
    description: "Acting Coach Session",
    category: "COACHING",
    date: new Date("2025-07-10"),
    reimbursable: false,
    reimbursed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    amount: 150,
    description: "Self-Tape Equipment",
    category: "SELF_TAPE_GEAR",
    date: new Date("2025-07-08"),
    reimbursable: false,
    reimbursed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    amount: 45,
    description: "Uber to Audition",
    category: "TRAVEL",
    date: new Date("2025-07-15"),
    reimbursable: true,
    reimbursed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const categoryIcons: Record<ExpenseCategory, React.ElementType> = {
  COACHING: BanknoteIcon,
  SELF_TAPE_GEAR: ReceiptIcon,
  TRAVEL: BanknoteIcon,
  WARDROBE: BanknoteIcon,
  HEADSHOTS: BanknoteIcon,
  MEMBERSHIPS: BanknoteIcon,
  OTHER: BanknoteIcon,
};

export default function ExpensesPage() {
  const { user, loading } = useSession();
  const [date, setDate] = useState<Date>();
  const [expenses, setExpenses] = useState(mockExpenses);
  const [showAddExpense, setShowAddExpense] = useState(false);

  // Add authentication checks
  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to view expenses
          </p>
          <Button asChild className="mt-4">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const reimbursableTotal = expenses
    .filter((e) => e.reimbursable && !e.reimbursed)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newExpense: ExpenseData = {
      id: Math.random().toString(),
      amount: parseFloat(formData.get("amount") as string),
      description: formData.get("description") as string,
      category: formData.get("category") as ExpenseCategory,
      date: date || new Date(),
      reimbursable: formData.get("reimbursable") === "true",
      reimbursed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setExpenses([newExpense, ...expenses]);
    setShowAddExpense(false);
    setDate(undefined);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">
            Track and manage your acting-related expenses
          </p>
        </div>
        <Button onClick={() => setShowAddExpense(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All time total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reimbursement
            </CardTitle>
            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${reimbursableTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting reimbursement
            </p>
          </CardContent>
        </Card>
      </div>

      {showAddExpense && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COACHING">Coaching</SelectItem>
                      <SelectItem value="SELF_TAPE_GEAR">Self Tape Gear</SelectItem>
                      <SelectItem value="TRAVEL">Travel</SelectItem>
                      <SelectItem value="WARDROBE">Wardrobe</SelectItem>
                      <SelectItem value="HEADSHOTS">Headshots</SelectItem>
                      <SelectItem value="MEMBERSHIPS">Memberships</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reimbursable">Reimbursable</Label>
                  <Select name="reimbursable" defaultValue="false">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddExpense(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Expense</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-2">
                  {React.createElement(categoryIcons[expense.category], {
                    className: "h-4 w-4 text-primary",
                  })}
                </div>
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(expense.date, "PPP")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">${expense.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category.replace("_", " ")}
                  </p>
                </div>
                {expense.reimbursable && !expense.reimbursed && (
                  <div className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    Reimbursable
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
