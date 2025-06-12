"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  DollarSignIcon,
  FilmIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/session-provider";
import Link from "next/link";

// Define types locally
type AuditionStatus = 'PENDING' | 'SUBMITTED' | 'CALLBACK' | 'BOOKED' | 'RELEASED';

interface AuditionStatusCount {
  status: AuditionStatus;
  count: number;
}

interface AuditionMonthCount {
  name: string;
  count: number;
}

interface UpcomingAudition {
  id: string;
  project_title: string;
  role_name: string;
  audition_date: string;
  casting_director: string;
  location: string;
  actor?: {
    name: string;
  };
}

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

export default function DashboardPage() {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [auditionsByStatus, setAuditionsByStatus] = useState<AuditionStatusCount[]>([]);
  const [auditionsByMonth, setAuditionsByMonth] = useState<AuditionMonthCount[]>([]);
  const [upcomingAuditions, setUpcomingAuditions] = useState<UpcomingAudition[]>([]);
  const [stats, setStats] = useState({
    totalAuditions: 0,
    callbacks: 0,
    bookings: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch auditions
      const { data: auditions, error } = await supabase
        .from('auditions')
        .select(`
          *,
          actors!actor_id (
            name
          )
        `)
        , user?.id);

      if (error) throw error;

      // Calculate stats
      const totalAuditions = auditions?.length || 0;
      const callbacks = auditions?.filter(a => a.status === 'CALLBACK').length || 0;
      const bookings = auditions?.filter(a => a.status === 'BOOKED').length || 0;

      setStats({
        totalAuditions,
        callbacks,
        bookings,
        expenses: 0, // TODO: Implement expenses
      });

      // Group by status
      const statusCounts = auditions?.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status: status as AuditionStatus,
        count,
      }));

      setAuditionsByStatus(statusData);

      // Group by month
      const monthCounts = auditions?.reduce((acc, curr) => {
        const month = new Date(curr.audition_date).toLocaleDateString('en-US', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const monthData = Object.entries(monthCounts).map(([name, count]) => ({
        name,
        count,
      }));

      setAuditionsByMonth(monthData);

      // Get upcoming auditions
      const upcoming = auditions?.filter(a => 
        new Date(a.audition_date) > new Date() && 
        ['PENDING', 'SUBMITTED', 'CALLBACK'].includes(a.status)
      ).slice(0, 3) || [];

      setUpcomingAuditions(upcoming);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to view your dashboard
          </p>
          <Button asChild className="mt-4">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/auditions/new">
              <FilmIcon className="mr-2 h-4 w-4" />
              New Audition
            </Link>
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Auditions"
              value={stats.totalAuditions.toString()}
              description="This year"
              icon={FilmIcon}
              trend="up"
              trendValue="12%"
            />
            <StatsCard
              title="Callbacks"
              value={stats.callbacks.toString()}
              description="This year"
              icon={ClipboardCheckIcon}
              trend="up"
              trendValue="18%"
            />
            <StatsCard
              title="Bookings"
              value={stats.bookings.toString()}
              description="This year"
              icon={CalendarIcon}
              trend="up"
              trendValue="9%"
            />
            <StatsCard
              title="Expenses"
              value="$0"
              description="This year"
              icon={DollarSignIcon}
              trend="down"
              trendValue="0%"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Audition Activity</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={auditionsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Auditions"
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Audition Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={auditionsByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          innerRadius + (outerRadius - innerRadius) * 1.2;
                        const x =
                          cx + radius * Math.cos(-midAngle * RADIAN) * 0.8;
                        const y =
                          cy + radius * Math.sin(-midAngle * RADIAN) * 0.8;
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#888"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontSize={12}
                          >
                            {auditionsByStatus[index]?.status.substring(0, 3)}{" "}
                            ({(percent * 100).toFixed(0)}%)
                          </text>
                        );
                      }}
                    >
                      {auditionsByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        value,
                        props.payload.status,
                      ]}
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Audition Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={auditionsByStatus}
                    layout="vertical"
                    margin={{ left: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="status"
                      type="category"
                      tick={{ fontSize: 14 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Auditions"
                      fill="hsl(var(--chart-1))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalAuditions > 0 ? 
                        ((stats.callbacks / stats.totalAuditions) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">Callback Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalAuditions > 0 ? 
                        ((stats.bookings / stats.totalAuditions) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">Booking Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {upcomingAuditions.length > 0 ? (
              upcomingAuditions.map((audition) => (
                <UpcomingAuditionCard key={audition.id} audition={audition} />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FilmIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No upcoming auditions</h3>
                  <p className="text-muted-foreground">Add a new audition to get started.</p>
                  <Button asChild className="mt-4">
                    <Link href="/auditions/new">Add Audition</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
}

function StatsCard({ title, value, description, icon: Icon, trend, trendValue }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div
            className={cn(
              "mt-2 flex items-center text-xs font-medium",
              trend === "up" ? "text-green-500" : "text-red-500"
            )}
          >
            {trend === "up" ? (
              <ArrowUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3" />
            )}
            {trendValue} from last year
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface UpcomingAuditionCardProps {
  audition: UpcomingAudition;
}

function UpcomingAuditionCard({ audition }: UpcomingAuditionCardProps) {
  const auditionDate = new Date(audition.audition_date);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:border-r md:min-w-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center md:items-center space-y-2">
            <div className="text-2xl font-bold text-primary">
              {auditionDate.toLocaleDateString("en-US", {
                day: "numeric",
              })}
            </div>
            <div className="text-sm font-medium">
              {auditionDate.toLocaleDateString("en-US", {
                month: "short",
              })}{" "}
              {auditionDate.getFullYear()}
            </div>
            <div className="text-sm text-muted-foreground">
              {auditionDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
        <CardContent className="flex-1 p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{audition.project_title}</h3>
              <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {audition.role_name}
              </div>
            </div>
            {audition.actor && (
              <p className="text-sm text-muted-foreground">
                Actor: {audition.actor.name}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Casting Director: {audition.casting_director}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                Location: {audition.location || 'Virtual'}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button size="sm">Prepare</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
