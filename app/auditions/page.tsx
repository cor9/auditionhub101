"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ClockIcon,
  FilmIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  ThumbsUpIcon,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define enums locally until Prisma is set up
type AuditionType = 'TV' | 'FILM' | 'COMMERCIAL' | 'THEATRE' | 'VOICEOVER' | 'OTHER';
type AuditionStatus = 'PENDING' | 'SUBMITTED' | 'CALLBACK' | 'BOOKED' | 'RELEASED';

// Mock data for demonstration
const mockAuditions = [
  {
    id: "1",
    projectTitle: "Disney Channel Series",
    roleName: "Lead Child Role",
    type: "TV" as AuditionType,
    status: "PENDING" as AuditionStatus,
    auditionDate: new Date("2025-07-15T14:30:00"),
    castingCompany: "Disney Casting",
    castingDirector: "Sarah Johnson",
    location: "Los Angeles, CA",
  },
  {
    id: "2",
    projectTitle: "Netflix Family Film",
    roleName: "Supporting Role",
    type: "FILM" as AuditionType,
    status: "SUBMITTED" as AuditionStatus,
    auditionDate: new Date("2025-07-18T10:00:00"),
    castingCompany: "Netflix Casting",
    castingDirector: "Michael Chen",
    location: "Virtual",
  },
  {
    id: "3",
    projectTitle: "National Cereal Commercial",
    roleName: "Energetic Kid",
    type: "COMMERCIAL" as AuditionType,
    status: "CALLBACK" as AuditionStatus,
    auditionDate: new Date("2025-07-20T16:15:00"),
    castingCompany: "Commercial Casting Inc.",
    castingDirector: "Lisa Rodriguez",
    location: "New York, NY",
  },
  {
    id: "4",
    projectTitle: "Summer Camp Adventure",
    roleName: "Camp Counselor",
    type: "FILM" as AuditionType,
    status: "BOOKED" as AuditionStatus,
    auditionDate: new Date("2025-07-05T11:00:00"),
    castingCompany: "Independent Films",
    castingDirector: "Jason Taylor",
    location: "Chicago, IL",
  },
  {
    id: "5",
    projectTitle: "Educational Series",
    roleName: "Science Kid",
    type: "TV" as AuditionType,
    status: "RELEASED" as AuditionStatus,
    auditionDate: new Date("2025-06-28T13:45:00"),
    castingCompany: "Educational Media",
    castingDirector: "Patricia Wong",
    location: "Virtual",
  },
];

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  SUBMITTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  CALLBACK: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  BOOKED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  RELEASED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const typeColors = {
  TV: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  FILM: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  COMMERCIAL: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  THEATRE: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  VOICEOVER: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const statusIcons = {
  PENDING: ClockIcon,
  SUBMITTED: SendIcon,
  CALLBACK: ThumbsUpIcon,
  BOOKED: CheckCircle2Icon,
  RELEASED: X,
};

export default function AuditionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AuditionStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<AuditionType | "ALL">("ALL");
  const [activeTab, setActiveTab] = useState("all");

  const filteredAuditions = mockAuditions.filter((audition) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      audition.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audition.roleName.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "ALL" || audition.status === statusFilter;

    // Type filter
    const matchesType = typeFilter === "ALL" || audition.type === typeFilter;

    // Tab filter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "upcoming" &&
        audition.auditionDate > new Date() &&
        ["PENDING", "SUBMITTED", "CALLBACK"].includes(audition.status)) ||
      (activeTab === "past" &&
        (audition.auditionDate <= new Date() || ["BOOKED", "RELEASED"].includes(audition.status)));

    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Auditions</h2>
          <p className="text-muted-foreground">
            Manage all your child's auditions in one place
          </p>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Audition
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search auditions..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <FilterIcon className="h-4 w-4" />
                Status
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("SUBMITTED")}>
                Submitted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("CALLBACK")}>
                Callback
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("BOOKED")}>
                Booked
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("RELEASED")}>
                Released
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <FilterIcon className="h-4 w-4" />
                Type
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTypeFilter("ALL")}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("TV")}>
                TV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("FILM")}>
                Film
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("COMMERCIAL")}>
                Commercial
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("THEATRE")}>
                Theatre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("VOICEOVER")}>
                Voiceover
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("OTHER")}>
                Other
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">All Auditions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredAuditions.map((audition) => (
              <AuditionCard key={audition.id} audition={audition} />
            ))}
            {filteredAuditions.length === 0 && (
              <EmptyState
                title="No auditions found"
                description="Try adjusting your search or filters."
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {filteredAuditions.map((audition) => (
              <AuditionCard key={audition.id} audition={audition} />
            ))}
            {filteredAuditions.length === 0 && (
              <EmptyState
                title="No upcoming auditions"
                description="Add a new audition to get started."
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4">
            {filteredAuditions.map((audition) => (
              <AuditionCard key={audition.id} audition={audition} />
            ))}
            {filteredAuditions.length === 0 && (
              <EmptyState
                title="No past auditions"
                description="Past auditions will appear here."
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AuditionCard({ audition }) {
  const StatusIcon = statusIcons[audition.status];

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="p-6 sm:border-r sm:min-w-[150px] flex items-center justify-center">
          <div className="flex flex-col items-center sm:items-center space-y-2">
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
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-lg">{audition.projectTitle}</h3>
              <Badge
                className={cn(
                  "ml-auto sm:ml-0",
                  typeColors[audition.type]
                )}
                variant="outline"
              >
                {audition.type}
              </Badge>
              <Badge
                className={cn(statusColors[audition.status])}
                variant="outline"
              >
                <StatusIcon className="mr-1 h-3 w-3" />
                {audition.status.charAt(0) + audition.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <p className="text-sm font-medium">Role: {audition.roleName}</p>
            <p className="text-sm text-muted-foreground">
              {audition.castingCompany} • CD: {audition.castingDirector}
            </p>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-3 w-3" />
                Location: {audition.location}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button variant="outline" size="sm">
              Update Status
            </Button>
            <Button size="sm">Prepare</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <FilmIcon className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mb-4 mt-2 text-sm text-muted-foreground">
        {description}
      </p>
      <Button>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Audition
      </Button>
    </div>
  );
}