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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";
import { Plus, Pencil, Trash2, User, Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/components/session-provider";
import Link from "next/link";

interface ActorProfile {
  id: string;
  name: string;
  gender?: string;
  email?: string;
  dob?: string;
  commercial_agent?: string;
  theatrical_agent?: string;
  regional_agent?: string;
  vo_agent?: string;
  manager?: string;
  headshot_url?: string;
  resume_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ActorsSettingsPage() {
  const { user } = useSession();
  const { toast } = useToast();
  const [actors, setActors] = useState<ActorProfile[]>([]);
  const [headshotUrl, setHeadshotUrl] = useState("");
const [resumeUrl, setResumeUrl] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchActors();
    }
  }, [user]);

  const fetchActors = async () => {
    try {
      setConnectionError(null);
      
      const { data, error } = await supabase
        .from('actors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      setActors(data || []);
    } catch (error: any) {
      console.error('Error fetching actors:', error);
      setConnectionError(error.message || 'Failed to connect to database');
      toast({
        title: "Connection Error",
        description: "Failed to connect to Supabase. Please check your environment variables.",
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
  gender: formData.get("gender") as string || null,
  email: formData.get("email") as string || null,
  dob: formData.get("dob") as string || null,
  commercial_agent: formData.get("commercial_agent") as string || null,
  theatrical_agent: formData.get("theatrical_agent") as string || null,
  regional_agent: formData.get("regional_agent") as string || null,
  vo_agent: formData.get("vo_agent") as string || null,
  manager: formData.get("manager") as string || null,
  headshot_url: headshotUrl || null,  // Use uploaded URL
  resume_url: resumeUrl || null,      // Use uploaded URL
  user_id: user?.id,
};
    // Validate required fields
    if (!actorData.name || !actorData.dob || !user?.id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name and Date of Birth)",
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
          .eq('id', isEditing);

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
      await fetchActors();
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
        .eq('id', id);

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
        .eq('id', id);

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

  if (connectionError) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Actors</h2>
          <p className="text-muted-foreground">
            Manage your child actors' profiles
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Supabase Connection Error:</strong> {connectionError}
            <br />
            <br />
            Please check that your Supabase environment variables are correctly set:
            <ul className="list-disc list-inside mt-2">
              <li>NEXT_PUBLIC_SUPABASE_URL should be your project URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY should be your anon/public key (starts with "eyJ")</li>
            </ul>
            <br />
            You can find these values in your Supabase project settings under "API".
          </AlertDescription>
        </Alert>
        
        <Button onClick={fetchActors} variant="outline">
          Retry Connection
        </Button>
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
                <CardDescription>
                  {actor.dob && `DOB: ${new Date(actor.dob).toLocaleDateString()}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  {actor.headshot_url ? (
                    <img 
                      src={actor.headshot_url} 
                      alt={`${actor.name} headshot`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  {actor.gender && (
                    <div>
                      <span className="font-medium">Gender:</span> {actor.gender}
                    </div>
                  )}
                  {actor.email && (
                    <div>
                      <span className="font-medium">Email:</span> {actor.email}
                    </div>
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
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Actor" : "Add New Actor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  disabled={isSaving}
                  defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.name : ""}
                  placeholder="Enter actor's full name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input 
                    id="dob" 
                    name="dob" 
                    type="date" 
                    required 
                    disabled={isSaving}
                    defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.dob : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select 
                    id="gender" 
                    name="gender" 
                    disabled={isSaving}
                    defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.gender || "" : ""}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  disabled={isSaving}
                  defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.email : ""}
                  placeholder="actor@example.com"
                />
              </div>
            </div>

            {/* Agent Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Representation</h4>
              
              <div className="space-y-2">
                <Label htmlFor="theatrical_agent">Theatrical Agent</Label>
                <Input 
                  id="theatrical_agent" 
                  name="theatrical_agent" 
                  disabled={isSaving}
                  defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.theatrical_agent : ""}
                  placeholder="Agent name or agency"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commercial_agent">Commercial Agent</Label>
                <Input 
                  id="commercial_agent" 
                  name="commercial_agent" 
                  disabled={isSaving}
                  defaultValue={isEditing ? actors.find(a => a.id === isEditing)?.commercial_agent : ""}
                  placeholder="Agent name or agency"
                />
              </div>
            </div>

            {/* Media Files */}
           <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Materials</h4>
              
              <FileUpload
                bucketName="actor-materials.headshots.resume"
                folder="headshots"
                acceptedTypes="image/*"
                label="Headshot"
                onUploadComplete={(url) => setHeadshotUrl(url)}
                currentUrl={isEditing ? actors.find(a => a.id === isEditing)?.headshot_url : ""}
              />

              <FileUpload
                bucketName="actor-materials.headshots.resume"
                folder="resumes"
                acceptedTypes="application/pdf"
                label="Resume (PDF)"
                onUploadComplete={(url) => setResumeUrl(url)}
                currentUrl={isEditing ? actors.find(a => a.id === isEditing)?.resume_url : ""}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
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
