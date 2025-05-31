"use client";

import { useState } from "react";
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

// Define types locally until Prisma is set up
type AuditionStatus = 'PENDING' | 'SUBMITTED' | 'CALLBACK' | 'BOOKED' | 'RELEASED';

interface AuditionStatusCount {
  status: AuditionStatus;
  count: number;
}

interface AuditionMonthCount {
  name: string;
  count: number;
}

interface ExpenseCategory {
  name: string;
  value: number;
}

interface UpcomingAudition {
  id: string;
  projectTitle: string;
  roleName: string;
  auditionDate: Date;
  castingDirector: string;
  location: string;
}

// Mock data for demonstration
const mockAuditionsByStatus: AuditionStatusCount[] = [
  { status: "PENDING", count: 5 },
  { status: "SUBMITTED", count: 12 },
  { status: "CALLBACK", count: 3 },
  { status: "BOOKED", count: 2 },
  { status: "RELEASED", count: 8 },
];

const mockAuditionsByMonth: AuditionMonthCount[] = [
  { name: "Jan", count: 4 },
  { name: "Feb", count: 3 },
  { name: "Mar", count: 5 },
  { name: "Apr", count: 7 },
  { name: "May", count: 2 },
  { name: "Jun", count: 6 },
  { name: "Jul", count: 8 },
  { name: "Aug", count: 10 },
  { name: "Sep", count: 12 },
  { name: "Oct", count: 5 },
  { name: "Nov", count: 7 },
  { name: "Dec", count: 4 },
];

const mockExpensesByCategory: ExpenseCategory[] = [
  { name: "Coaching", value: 1200 },
  { name: "Self Tape", value: 800 },
  { name: "Travel", value: 500 },
  { name: "Wardrobe", value: 350 },
  { name: "Headshots", value: 1000 },
];

const mockUpcomingAuditions: UpcomingAudition[] = [
  {
    id: "1",
    projectTitle: "Disney Channel Series",
    roleName: "Lead Child Role",
    auditionDate: new Date("2025-07-15T14:30:00"),
    castingDirector: "Sarah Johnson",
    location: "Los Angeles, CA",
  },
  {
    id: "2",
    projectTitle: "Netflix Family Film",
    roleName: "Supporting Role",
    auditionDate: new Date("2025-07-18T10:00:00"),
    castingDirector: "Michael Chen",
    location: "Virtual",
  },
  {
    id: "3",
    projectTitle: "National Cereal Commercial",
    roleName: "Energetic Kid",
    auditionDate: new Date("2025-07-20T16:15:00"),
    castingDirector: "Lisa Rodriguez",
    location: "New York, NY",
  },
];

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <FilmIcon className="mr-2 h-4 w-4" />
            New Audition
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
              value="30"
              description="This year"
              icon={FilmIcon}
              trend="up"
              trendValue="12%"
            />
            <StatsCard
              title="Callbacks"
              value="8"
              description="This year"
              icon={ClipboardCheckIcon}
              trend="up"
              trendValue="18%"
            />
            <StatsCard
              title="Bookings"
              value="5"
              description="This year"
              icon={CalendarIcon}
              trend="up"
              trendValue="9%"
            />
            <StatsCard
              title="Expenses"
              value="$3,250"
              description="This year"
              icon={DollarSignIcon}
              trend="down"
              trendValue="5%"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Audition Activity</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={mockAuditionsByMonth}>
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
                      data={mockAuditionsByStatus}
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
                            {mockAuditionsByStatus[index].status.substring(0, 3)}{" "}
                            ({(percent * 100).toFixed(0)}%)
                          </text>
                        );
                      }}
                    >
                      {mockAuditionsByStatus.map((entry, index) => (
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
                    data={mockAuditionsByStatus}
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
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={mockExpensesByCategory}
                      dataKey="value"
                      nameKey="name"
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
                            {mockExpensesByCategory[index].name}{" "}
                            (${mockExpensesByCategory[index].value})
                          </text>
                        );
                      }}
                    >
                      {mockExpensesByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Amount"]}
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

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {mockUpcomingAuditions.map((audition) => (
              <UpcomingAuditionCard key={audition.id} audition={audition} />
            ))}
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
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:border-r md:min-w-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center md:items-center space-y-2">
            <div className="text-2xl font-bold text-primary">
              {audition.auditionDate.toLocaleDateString("en-US", {
                day: "numeric",
              })}
            </div>
            <div className="text-sm font-medium">
              {audition.auditionDate.toLocaleDateString("en-US", {
                month: "short",
              })}{" "}
              {audition.auditionDate.getFullYear()}
            </div>
            <div className="text-sm text-muted-foreground">
              {audition.auditionDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
        <CardContent className="flex-1 p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{audition.projectTitle}</h3>
              <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {audition.roleName}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Casting Director: {audition.castingDirector}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                Location: {audition.location}
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