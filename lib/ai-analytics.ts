import type { AuditionData, InsightData } from '@/types';

export async function generateAuditionInsights(auditions: AuditionData[]): Promise<InsightData[]> {
  // Calculate success rates
  const totalAuditions = auditions.length;
  const callbacks = auditions.filter(a => a.status === 'CALLBACK').length;
  const bookings = auditions.filter(a => a.status === 'BOOKED').length;
  
  const callbackRate = (callbacks / totalAuditions) * 100;
  const bookingRate = (bookings / totalAuditions) * 100;

  // Analyze patterns
  const typeFrequency = auditions.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonType = Object.entries(typeFrequency)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  // Generate insights
  const insights: InsightData[] = [
    {
      id: 'callback-rate',
      title: 'Callback Performance',
      content: `Your callback rate is ${callbackRate.toFixed(1)}%, ${
        callbackRate > 15 ? 'which is above industry average' : 'consider focusing on audition preparation'
      }.`,
      type: 'PERFORMANCE',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'booking-success',
      title: 'Booking Success',
      content: `Your booking rate is ${bookingRate.toFixed(1)}%. ${
        bookingRate > 5 ? 'Great job!' : 'Consider working with a coach to improve callback to booking conversion.'
      }`,
      type: 'PERFORMANCE',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'type-analysis',
      title: 'Audition Type Trends',
      content: `You're most frequently auditioning for ${mostCommonType} roles. Consider diversifying your audition types to expand opportunities.`,
      type: 'CASTING_TRENDS',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  return insights;
}

export function analyzeAuditionTrends(auditions: AuditionData[]) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentAuditions = auditions.filter(a => 
    new Date(a.auditionDate!) >= sixMonthsAgo
  );

  const monthlyTrends = recentAuditions.reduce((acc, curr) => {
    const month = new Date(curr.auditionDate!).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return {
    monthlyTrends,
    totalRecent: recentAuditions.length,
    improvement: calculateImprovement(recentAuditions)
  };
}

function calculateImprovement(auditions: AuditionData[]) {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const recent = auditions.filter(a => 
    new Date(a.auditionDate!) >= threeMonthsAgo
  );
  const older = auditions.filter(a => 
    new Date(a.auditionDate!) < threeMonthsAgo
  );

  const recentSuccessRate = calculateSuccessRate(recent);
  const olderSuccessRate = calculateSuccessRate(older);

  return ((recentSuccessRate - olderSuccessRate) / olderSuccessRate) * 100;
}

function calculateSuccessRate(auditions: AuditionData[]) {
  if (auditions.length === 0) return 0;
  const successful = auditions.filter(a => 
    ['CALLBACK', 'BOOKED'].includes(a.status)
  ).length;
  return (successful / auditions.length) * 100;
}