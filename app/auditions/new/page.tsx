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
import { FileUpload } from "@/components/FileUpload";
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
  dob: string;
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
  const [sidesUrl, setSidesUrl] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchActors();
    }
  }, [user]);

  const fetchActors = async () => {
    try {
      const { data, error } = await supabase
        .from('actors')
        .select('id, name, dob, is_active')
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

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const [headshotUrl, setHeadshotUrl] = useState("");
const [resumeUrl, setResumeUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const auditionData = {
  actor_id: formData.get("actor"),
  project_title: formData.get("project_title"),
  role_name: formData.get("role_name"),
  role_size: formData.get("role_size") || "costar",
  project_type: formData.get("project_type"),
  appt_type: formData.get("appt_type") || "self_tape",
  status: "submitted",
  casting_director: formData.get("casting_director"),
  is_in_person: formData.get("location") ? true : false,
  location: formData.get("location") || null,
  audition_date: date?.toISOString(),
  source: formData.get("source") || "self",
  is_union: formData.get("is_union") === "true",
  breakdown: formData.get("breakdown"),
  date_submitted: new Date().toISOString().split('T')[0],
  notes: formData.get("notes") || null,
  sides_url: sidesUrl || null,  // Add this field
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actor">Select Actor *</Label>
                <Select name="actor" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an actor" />
                  </SelectTrigger>
                  <SelectContent>
                    {actors.map((actor) => (
                      <SelectItem key={actor.id} value={actor.id}>
                        {actor.name} (Age {calculateAge(actor.dob)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_title">Project Title *</Label>
                <Input
                  id="project_title"
                  name="project_title"
                  placeholder="e.g., Disney Channel Series"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role_name">Role Name *</Label>
                <Input
                  id="role_name"
                  name="role_name"
                  placeholder="e.g., Lead Child Role"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_type">Project Type *</Label>
                  <Select name="project_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tv">TV</SelectItem>
                      <SelectItem value="film">Film</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="theatre">Theatre</SelectItem>
                      <SelectItem value="voice_over">Voice Over</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role_size">Role Size</Label>
                  <Select name="role_size">
                    <SelectTrigger>
                      <SelectValue placeholder="Select role size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="supporting">Supporting</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="series_regular">Series Regular</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="guest_star">Guest Star</SelectItem>
                      <SelectItem value="costar">Co-Star</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appt_type">Audition Type *</Label>
                  <Select name="appt_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="How will you audition?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_tape">Self Tape</SelectItem>
                      <SelectItem value="in_person">In Person</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
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
                <Label htmlFor="casting_director">Casting Director *</Label>
                <Input
                  id="casting_director"
                  name="casting_director"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select name="source">
                    <SelectTrigger>
                      <SelectValue placeholder="How did you get this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self Submit</SelectItem>
                      <SelectItem value="theatrical_agent">Theatrical Agent</SelectItem>
                      <SelectItem value="commercial_agent">Commercial Agent</SelectItem>
                      <SelectItem value="regional_agent">Regional Agent</SelectItem>
                      <SelectItem value="vo_agent">VO Agent</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_union">Union Status</Label>
                  <Select name="is_union">
                    <SelectTrigger>
                      <SelectValue placeholder="Union or Non-Union?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Union</SelectItem>
                      <SelectItem value="false">Non-Union</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
            <div className="space-y-2">
  <FileUpload
    bucketName="sides"
    folder={`audition-${Date.now()}`}
    acceptedTypes="application/pdf,image/*"
    label="Sides / Script (PDF or Images)"
    onUploadComplete={(url) => setSidesUrl(url)}
  />
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
