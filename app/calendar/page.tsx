"use client";

import { useState } from "react";
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
import { CalendarIcon, MapPinIcon } from "lucide-react";
import type { AuditionData } from "@/types";

// Mock data for demonstration
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
];

export default function CalendarPage() {
  const [selectedAudition, setSelectedAudition] = useState<AuditionData | null>(null);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <p className="text-muted-foreground">
          View and manage your upcoming auditions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audition Schedule</CardTitle>
          <CardDescription>
            All your auditions in one calendar view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SmartCalendar
            auditions={mockAuditions}
            onSelectEvent={(event) => setSelectedAudition(event.resource)}
          />
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
              <CalendarIcon className="h-4 w-4" />
              {selectedAudition?.auditionDate && (
                format(new Date(selectedAudition.auditionDate), "PPP p")
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="h-4 w-4" />
              {selectedAudition?.location}
            </div>
            <div className="space-y-2 text-sm">
              <p>Casting Company: {selectedAudition?.castingCompany}</p>
              <p>Casting Director: {selectedAudition?.castingDirector}</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setSelectedAudition(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}