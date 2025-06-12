"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/session-provider";
import Link from "next/link";

interface ActorProfile {
  id: string;
  name: string;
  age: number;
  is_active: boolean;
}

export default function NewAuditionPage() {
  const router = useRouter();
  const { user } = useSession();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actors, setActors] = useState<ActorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchActors();
    }
  }, [user]);

  const fetchActors = async () => {
    try {
      const { data, error } = await supabase
        .from('actors')
        .select('id, name, age, is_active')
        , user?.id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setActors(data || []);
    } catch (error) {
      console.error('Error fetching actors:', error);
      toast({
        title: "Error",
        description: "Failed to load actors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const auditionData = {
        user_id: user?.id,
        actor_id: formData.get("actor"),
        project_title: formData.get("projectTitle"),
        role_name: formData.get("roleName"),
        role_size: formData.get("roleSize") || "COSTAR",
        type: formData.get("type"),
        casting_director: formData.get("castingDirector"),
        is_in_person: formData.get("location") ? true : false,
        location: formData.get("location") || "Virtual",
        audition_date: date?.toISOString(),
        source: formData.get("source") || "SELF_SUBMIT",
        union: formData.get("union") || "NON_UNION",
        breakdown: formData.get("breakdown"),
        date_submitted: new Date().toISOString(),
        notes: formData.get("notes"),
        status: 'PENDING',
      };

      const { error } = await supabase
        .from('auditions')
        .insert([auditionData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Audition created successfully!",
      });

      router.push("/auditions");
    } catch (error) {
      console.error('Error creating audition:', error);
      toast({
        title: "Error",
        description: "Failed to create audition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to create auditions
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
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (actors.length === 0) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">No Actors Found</h2>
          <p className="text-muted-foreground">
            You need to add at least one actor before creating auditions
          </p>
          <Button asChild className="mt-4">
            <Link href="/settings/actors">Add Actor</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Audition</h2>
          <p className="text-muted-foreground">
            Add details about your upcoming audition
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Audition Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Essential Fields Only */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actor">Which Actor? *</Label>
                <Select name="actor" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select actor" />
                  </SelectTrigger>
                  <SelectContent>
                    {actors.map((actor) => (
                      <SelectItem key={actor.id} value={actor.id}>
                        {actor.name} (Age {actor.age})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  name="projectTitle"
                  placeholder="e.g., Disney Channel Series"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name *</Label>
                <Input
                  id="roleName"
                  name="roleName"
                  placeholder="e.g., Lead Child Role"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Project Type *</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TV">TV</SelectItem>
                      <SelectItem value="FILM">Film</SelectItem>
                      <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                      <SelectItem value="THEATRE">Theatre</SelectItem>
                      <SelectItem value="VOICEOVER">Voiceover</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Audition Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="castingDirector">Casting Director *</Label>
                <Input
                  id="castingDirector"
                  name="castingDirector"
                  placeholder="e.g., Sarah Johnson"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Leave blank for virtual auditions"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breakdown">Role Description *</Label>
                <Textarea
                  id="breakdown"
                  name="breakdown"
                  placeholder="Describe the role and what they're looking for..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any other important details..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !date}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Audition"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}