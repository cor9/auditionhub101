"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SmartCalendar } from "@/components/smart-calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, Clock, Building2, User } from "lucide-react";
import type { AuditionData } from "@/types";
import Link from "next/link";

export default function CalendarPage() {
  const [auditions, setAuditions] = useState<AuditionData[]>([]);
  const [selectedAudition, setSelectedAudition] = useState<AuditionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchAuditions = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Using mock data for now
        const mockAuditions: AuditionData[] = [
          {
            id: "1",
            projectTitle: "Disney Channel Series",
            roleName: "Lead Child Role",
            type: "TV",
            status: "PENDING",
            auditionDate: new Date("2025-07-15T14:30:00"),
            castingCompany: "Disney Casting",
            castingDirector: "Sarah Johnson",
            location: "Los Angeles, CA",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            projectTitle: "Netflix Family Film",
            roleName: "Supporting Role",
            type: "FILM",
            status: "SUBMITTED",
            auditionDate: new Date("2025-07-18T10:00:00"),
            castingCompany: "Netflix Casting",
            castingDirector: "Michael Chen",
            location: "Virtual",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "3",
            projectTitle: "National Cereal Commercial",
            roleName: "Energetic Kid",
            type: "COMMERCIAL",
            status: "CALLBACK",
            auditionDate: new Date("2025-07-20T16:15:00"),
            castingCompany: "Commercial Casting Inc.",
            castingDirector: "Lisa Rodriguez",
            location: "New York, NY",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

        setAuditions(mockAuditions);
      } catch (error) {
        console.error("Failed to fetch auditions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditions();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            View and manage your upcoming auditions
          </p>
        </div>
        <Button asChild>
          <Link href="/auditions/new">Add Audition</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audition Schedule</CardTitle>
          <CardDescription>
            All your auditions in one calendar view
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[600px] items-center justify-center">
              <div className="text-center">
                <CalendarIcon className="mx-auto h-10 w-10 animate-pulse text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Loading calendar...</p>
              </div>
            </div>
          ) : (
            <SmartCalendar
              auditions={auditions}
              onSelectEvent={(event) => setSelectedAudition(event.resource)}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedAudition} onOpenChange={() => setSelectedAudition(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAudition?.projectTitle}</DialogTitle>
            <DialogDescription>
              Role: {selectedAudition?.roleName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {selectedAudition?.auditionDate && (
                format(new Date(selectedAudition.auditionDate), "PPP p")
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              {selectedAudition?.location}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              {selectedAudition?.castingCompany}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              CD: {selectedAudition?.castingDirector}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedAudition(null)}>
                Close
              </Button>
              <Button asChild>
                <Link href={`/auditions/${selectedAudition?.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}