import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import type { ExpenseData } from "@/types";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    
    // TODO: Replace with actual database insertion
    console.log("Creating expense:", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Expense creation error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Replace with actual database query
    const mockExpenses: ExpenseData[] = [
      // ... mock data from existing expenses page
    ];

    return NextResponse.json(mockExpenses);
  } catch (error) {
    console.error("Expenses fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}