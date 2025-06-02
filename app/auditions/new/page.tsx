"use client";

import { useState } from "react";
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
import { CalendarIcon, ChevronLeftIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";
import type { AuditionType } from "@/types";

export default function NewAuditionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // TODO: Implement actual form submission with file URLs
      console.log({
        projectTitle: formData.get("projectTitle"),
        roleName: formData.get("roleName"),
        type: formData.get("type"),
        castingCompany: formData.get("castingCompany"),
        castingDirector: formData.get("castingDirector"),
        location: formData.get("location"),
        date: date,
        notes: formData.get("notes"),
        files: uploadedFiles,
      });

      toast({
        title: "Success",
        description: "Audition created successfully!",
      });

      router.push("/auditions");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create audition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (fileUrl: string) => {
    setUploadedFiles(files => files.filter(f => f.url !== fileUrl));
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
                <Label htmlFor="type">Type</Label>
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
                <Label htmlFor="castingCompany">Casting Company</Label>
                <Input
                  id="castingCompany"
                  name="castingCompany"
                  placeholder="Enter casting company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="castingDirector">Casting Director</Label>
                <Input
                  id="castingDirector"
                  name="castingDirector"
                  placeholder="Enter casting director"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter location or virtual link"
                />
              </div>
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
            </div>

            <div className="space-y-2">
              <Label>Upload Materials</Label>
              <UploadDropzone
                endpoint="auditionMaterial"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const newFiles = res.map(file => ({
                      url: file.url,
                      name: file.name
                    }));
                    setUploadedFiles(prev => [...prev, ...newFiles]);
                    toast({
                      title: "Upload complete",
                      description: "Files uploaded successfully!",
                    });
                  }
                }}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Upload failed",
                    description: error.message,
                    variant: "destructive",
                  });
                }}
              />
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Uploaded Files</Label>
                  <div className="grid gap-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.url}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span className="truncate text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.url)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any additional notes or instructions"
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