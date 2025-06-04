"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import type { ActorProfile } from "@/types";

// Mock data for demonstration
const mockActors: ActorProfile[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 12,
    gender: "Female",
    ethnicity: "Caucasian",
    height: "4'11\"",
    weight: "90 lbs",
    hairColor: "Brown",
    eyeColor: "Blue",
    bio: "Energetic young actress with experience in musical theatre and commercials.",
    headshot: "https://example.com/headshot1.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 8,
    gender: "Male",
    ethnicity: "Asian",
    height: "4'2\"",
    weight: "65 lbs",
    hairColor: "Black",
    eyeColor: "Brown",
    bio: "Charismatic child actor with a natural talent for comedy.",
    headshot: "https://example.com/headshot2.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ActorsSettingsPage() {
  const { toast } = useToast();
  const [actors, setActors] = useState<ActorProfile[]>(mockActors);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const actorData = {
      name: formData.get("name") as string,
      age: parseInt(formData.get("age") as string),
      gender: formData.get("gender") as string,
      ethnicity: formData.get("ethnicity") as string,
      height: formData.get("height") as string,
      weight: formData.get("weight") as string,
      hairColor: formData.get("hairColor") as string,
      eyeColor: formData.get("eyeColor") as string,
      bio: formData.get("bio") as string,
    };

    try {
      // TODO: Implement API call
      toast({
        title: "Success",
        description: isEditing ? "Actor updated successfully" : "Actor added successfully",
      });
      
      setIsEditing(null);
      setIsAddingNew(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save actor profile",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Implement API call
      setActors(actors.filter(actor => actor.id !== id));
      toast({
        title: "Success",
        description: "Actor deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete actor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Actors</h2>
          <p className="text-muted-foreground">
            Manage your child actors' profiles
          </p>
        </div>
        <Button onClick={() => setIsAddingNew(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Actor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {actors.map((actor) => (
          <Card key={actor.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {actor.name}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(actor.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(actor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Age: {actor.age}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                {actor.headshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={actor.headshot}
                    alt={`${actor.name}'s headshot`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Gender:</span> {actor.gender}
                </div>
                <div>
                  <span className="font-medium">Ethnicity:</span> {actor.ethnicity}
                </div>
                <div>
                  <span className="font-medium">Height:</span> {actor.height}
                </div>
                <div>
                  <span className="font-medium">Weight:</span> {actor.weight}
                </div>
                <div>
                  <span className="font-medium">Hair:</span> {actor.hairColor}
                </div>
                <div>
                  <span className="font-medium">Eyes:</span> {actor.eyeColor}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{actor.bio}</p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`active-${actor.id}`}>Active</Label>
                <Switch
                  id={`active-${actor.id}`}
                  checked={actor.isActive}
                  onCheckedChange={(checked) => {
                    // TODO: Implement status update
                    toast({
                      title: "Status updated",
                      description: `${actor.name} is now ${checked ? "active" : "inactive"}`,
                    });
                  }}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isAddingNew || !!isEditing} onOpenChange={() => {
        setIsAddingNew(false);
        setIsEditing(null);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Actor Profile" : "Add New Actor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" type="number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" name="gender" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity</Label>
              <Input id="ethnicity" name="ethnicity" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" name="height" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" name="weight" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hairColor">Hair Color</Label>
                <Input id="hairColor" name="hairColor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eyeColor">Eye Color</Label>
                <Input id="eyeColor" name="eyeColor" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" />
            </div>
            <div className="space-y-2">
              <Label>Headshot</Label>
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Handle upload complete
                  toast({
                    title: "Upload complete",
                    description: "Headshot uploaded successfully",
                  });
                }}
                onUploadError={(error: Error) => {
                  // Handle upload error
                  toast({
                    title: "Upload failed",
                    description: error.message,
                    variant: "destructive",
                  });
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setIsEditing(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Save Changes" : "Add Actor"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}