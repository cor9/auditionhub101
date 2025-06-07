// This file is kept for compatibility but we're using Supabase auth directly
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Using Supabase Auth" });
}

export async function POST() {
  return NextResponse.json({ message: "Using Supabase Auth" });
}