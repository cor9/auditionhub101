import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateAuditionInsights, analyzeAuditionTrends } from "@/lib/ai-analytics";
import type { AuditionData } from "@/types";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Replace with actual database query
    const mockAuditions: AuditionData[] = [
      // ... mock data from existing auditions page
    ];

    const insights = await generateAuditionInsights(mockAuditions);
    const trends = analyzeAuditionTrends(mockAuditions);

    return NextResponse.json({
      insights,
      trends,
      recentAuditions: mockAuditions.slice(0, 5),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to generate analytics" },
      { status: 500 }
    );
  }
}