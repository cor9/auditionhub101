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
import { Checkbox } from "@/components/ui/checkbox";
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
import type { ActorProfile } from "@/types";

export default function NewAuditionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [submitDate, setSubmitDate] = useState<Date>();
  const [isInPerson, setIsInPerson] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actors, setActors] = useState<ActorProfile[]>([]);

  useEffect(() => {
    async function fetchActors() {
      const { data, error } = await supabase
        .from('actors')
        .select('*')
        .eq('is_active', true);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load actors",
          variant: "destructive",
        });
        return;
      }

      setActors(data);
    }

    fetchActors();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      if (!date || !submitDate) {
        throw new Error("Please select both audition date and submission date");
      }

      const auditionData = {
        actor_id: formData.get("actor"),
        project_title: formData.get("projectTitle"),
        role_name: formData.get("roleName"),
        role_size: formData.get("roleSize"),
        type: formData.get("type"),
        casting_director: formData.get("castingDirector"),
        is_in_person: isInPerson,
        location: isInPerson ? formData.get("location") : null,
        audition_date: date.toISOString(),
        source: formData.get("source"),
        union: formData.get("union"),
        breakdown: formData.get("breakdown"),
        date_submitted: submitDate.toISOString(),
        notes: formData.get("notes"),
      };

      const { error } = await supabase
        .from('auditions')
        .insert(auditionData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Audition created successfully!",
      });

      router.push("/auditions");
    } catch (error) {
      console.error("Error creating audition:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create audition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <Card>
        <CardHeader>
          <CardTitle>Audition Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="actor">Actor</Label>
                <Select name="actor" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select actor" />
                  </SelectTrigger>
                  <SelectContent>
                    {actors.map((actor) => (
                      <SelectItem key={actor.id} value={actor.id}>
                        {actor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  name="projectTitle"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  name="roleName"
                  placeholder="Enter role name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleSize">Role Size</Label>
                <Select name="roleSize" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRINCIPAL">Principal</SelectItem>
                    <SelectItem value="SUPPORTING">Supporting</SelectItem>
                    <SelectItem value="LEAD">Lead</SelectItem>
                    <SelectItem value="SERIES_REGULAR">Series Regular</SelectItem>
                    <SelectItem value="FRACTIONAL_SERIES_REGULAR">Fractional Series Regular</SelectItem>
                    <SelectItem value="RECURRING_GUEST_STAR">Recurring Guest Star</SelectItem>
                    <SelectItem value="GUEST_STAR">Guest Star</SelectItem>
                    <SelectItem value="RECURRING_COSTAR">Recurring Co-Star</SelectItem>
                    <SelectItem value="COSTAR">Co-Star</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Project Type</Label>
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
                <Label htmlFor="castingDirector">Casting Director</Label>
                <Input
                  id="castingDirector"
                  name="castingDirector"
                  placeholder="Enter casting director"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isInPerson"
                    checked={isInPerson}
                    onCheckedChange={(checked) => setIsInPerson(checked as boolean)}
                  />
                  <Label htmlFor="isInPerson">In-Person Audition</Label>
                </div>
              </div>

              {isInPerson && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter location"
                    required={isInPerson}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Audition Date</Label>
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

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select name="source" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AGENCY">Agency</SelectItem>
                    <SelectItem value="MANAGEMENT">Management</SelectItem>
                    <SelectItem value="SELF_SUBMIT">Self Submit</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="union">Union Status</Label>
                <Select name="union" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select union status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NON_UNION">Non-Union</SelectItem>
                    <SelectItem value="SAG_AFTRA">SAG/AFTRA</SelectItem>
                    <SelectItem value="AEA">AEA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Submitted</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !submitDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {submitDate ? format(submitDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={submitDate}
                      onSelect={setSubmitDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breakdown">Breakdown</Label>
              <Textarea
                id="breakdown"
                name="breakdown"
                placeholder="Enter role breakdown"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any additional notes"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
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