import { useState, useEffect } from "react";
import type { InsightData } from "@/types";

interface AnalyticsData {
  insights: InsightData[];
  trends: {
    monthlyTrends: Record<number, number>;
    totalRecent: number;
    improvement: number;
  };
  recentAuditions: any[];
  isLoading: boolean;
  error: string | null;
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    insights: [],
    trends: {
      monthlyTrends: {},
      totalRecent: 0,
      improvement: 0,
    },
    recentAuditions: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const analyticsData = await response.json();
        setData({
          ...analyticsData,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: "Failed to load analytics",
        }));
      }
    }

    fetchAnalytics();
  }, []);

  return data;
}