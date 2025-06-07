"use client";

import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, User, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/session-provider";
import Link from "next/link";

interface ActorProfile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ActorsSettingsPage() {
  const { user } = useSession();
  const { toast } = useToast();
  const [actors, setActors] = useState<ActorProfile[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchActors();
    }
  }, [user]);

  const fetchActors = async () => {
    try {
      const { data, error } = await supabase
        .from('actors')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setActors(data || []);
    } catch (error) {
      console.error('Error fetching actors:', error);
      toast({
        title: "Error",
        description: "Failed to load actors. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    
    const actorData = {
      name: formData.get("name") as string,
      age: parseInt(formData.get("age") as string),
      gender: formData.get("gender") as string || null,
      bio: formData.get("bio") as string || null,
      user_id: user?.id,
    };

    // Validate required fields
    if (!actorData.name || !actorData.age || !user?.id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('actors')
          .update(actorData)
          .eq('id', isEditing)
          .eq('user_id', user?.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Actor updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('actors')
          .insert([actorData]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Actor added successfully",
        });
      }
      
      setIsEditing(null);
      setIsAddingNew(false);
      await fetchActors(); // Refresh the list
    } catch (error: any) {
      console.error('Error saving actor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save actor profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this actor?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('actors')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setActors(actors.filter(actor => actor.id !== id));
      toast({
        title: "Success",
        description: "Actor deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting actor:', error);
      toast({
        title: "Error",
        description: "Failed to delete actor",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('actors')
        .update({ is_active: isActive })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setActors(actors.map(actor => 
        actor.id === id ? { ...actor, is_active: isActive } : actor
      ));

      toast({
        title: "Status updated",
        description: `Actor is now ${isActive ? "active" : "inactive"}`,
      });
    } catch (error) {
      console.error('Error updating actor status:', error);
      toast({
        title: "Error",
        description: "Failed to update actor status",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Please Sign In</h2>
          <p className="text-muted-foreground">
            You need to be signed in to manage actors
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
          <p className="mt-2 text-muted-foreground">Loading actors...</p>
        </div>
      </div>
    );
  }

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

      {actors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No actors yet</h3>
            <p className="text-muted-foreground">Add your first actor to get started.</p>
            <Button onClick={() => setIsAddingNew(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Actor
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                  <div className="flex h-full items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  {actor.gender && (
                    <div>
                      <span className="font-medium">Gender:</span> {actor.gender}
                    </div>
                  )}
                  {actor.bio && (
                    <p className="text-muted-foreground">{actor.bio}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`active-${actor.id}`}>Active</Label>
                  <Switch
                    id={`active-${actor.id}`}
                    checked={actor.is_active}
                    onCheckedChange={(checked) => handleToggleActive(actor.id, checked)}
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddingNew || !!isEditing} onOpenChange={() => {
        if (!isSaving) {
          setIsAddingNew(false);
          setIsEditing(null);
        }
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Actor" : "Add New Actor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name" 
                name="name" 
                required 
                disabled={isSaving}
                defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.name : ""}
                placeholder="Enter actor's name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input 
                  id="age" 
                  name="age" 
                  type="number" 
                  min="1"
                  max="18"
                  required 
                  disabled={isSaving}
                  defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.age : ""}
                  placeholder="Age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input 
                  id="gender" 
                  name="gender" 
                  disabled={isSaving}
                  defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.gender : ""}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                disabled={isSaving}
                defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.bio : ""}
                placeholder="Brief description (optional)"
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => {
                  setIsAddingNew(false);
                  setIsEditing(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  isEditing ? "Save Changes" : "Add Actor"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}