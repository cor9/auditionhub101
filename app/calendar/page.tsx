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
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/session-provider";
import Link from "next/link";

interface AuditionData {
  id: string;
  project_title: string;
  role_name: string;
  type: string;
  status: string;
  audition_date: string;
  casting_director: string;
  location: string;
  actor?: {
    name: string;
  };
}

export default function CalendarPage() {
  const { user, loading } = useSession();
  const [auditions, setAuditions] = useState<AuditionData[]>([]);
  const [selectedAudition, setSelectedAudition] = useState<AuditionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAuditions();
    }
  }, [user]);

  const fetchAuditions = async () => {
    try {
      const { data, error } = await supabase
        .from('auditions')
        .select(`
          *,
          actors (
            name
          )
        `)
        
        .order('audition_date', { ascending: true });

      if (error) throw error;
      setAuditions(data || []);
    } catch (error) {
      console.error('Error fetching auditions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to view your calendar
          </p>
          <Button asChild className="mt-4">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

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
          ) : auditions.length > 0 ? (
            <SmartCalendar
              auditions={auditions}
              onSelectEvent={(event) => setSelectedAudition(event.resource)}
            />
          ) : (
            <div className="flex h-[600px] items-center justify-center">
              <div className="text-center">
                <CalendarIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No auditions scheduled</p>
                <Button asChild className="mt-4">
                  <Link href="/auditions/new">Add Your First Audition</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedAudition} onOpenChange={() => setSelectedAudition(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAudition?.project_title}</DialogTitle>
            <DialogDescription>
              Role: {selectedAudition?.role_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {selectedAudition?.audition_date && (
                format(new Date(selectedAudition.audition_date), "PPP p")
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              {selectedAudition?.location || 'Virtual'}
            </div>
            {selectedAudition?.actor && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                Actor: {selectedAudition.actor.name}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              CD: {selectedAudition?.casting_director}
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
