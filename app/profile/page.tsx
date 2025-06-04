"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserCircle, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ProfilePage() {
  // Diagnostic log to verify which version of the file is being built
  console.log("<<<<<< BUILDING PROFILE PAGE - VERSION: CLEAN_COPY_PASTE_001 - " + new Date().toISOString() + " >>>>>>");

  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      console.log("Profile update form data:", Object.fromEntries(formData));
      // TODO: Implement actual profile update logic here (e.g., call Supabase or your backend)
      
      // Simulate API call delay for testing loader
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      toast({
        title: "Success (Simulated)",
        description: "Your profile data has been logged. Update functionality pending.",
      });
    } catch (error) {
      let errorMessage = "Failed to update profile. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  }; // This correctly closes the handleSubmit arrow function

  // Ensure there are no other '};' before this return statement
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and child actor information
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Clock className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Parent Information</CardTitle>
                  <CardDescription>
                    Update your contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Full Name</Label>
                    <Input
                      id="parentName"
                      name="parentName"
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        disabled={isLoading}
                      />
                      <Button variant="outline" size="icon" disabled={isLoading}>
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        disabled={isLoading}
                      />
                      <Button variant="outline" size="icon" disabled={isLoading}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, State"
                        disabled={isLoading}
                      />
                      <Button variant="outline" size="icon" disabled={isLoading}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Child Actor Information</CardTitle>
                  <CardDescription>
                    Update your child's details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="childName">Child's Name</Label>
                    <Input
                      id="childName"
                      name="childName"
                      placeholder="Enter child's name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="childAge">Age</Label>
                      <Input
                        id="childAge"
                        name="childAge"
                        type="number"
                        min="0"
                        max="18"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="childGender">Gender</Label>
                      <Select name="childGender" disabled={isLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="childHeight">Height</Label>
                      <Input
                        id="childHeight"
                        name="childHeight"
                        placeholder="e.g., 4'2\""
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="childWeight">Weight</Label>
                      <Input
                        id="childWeight"
                        name="childWeight"
                        placeholder="e.g., 75 lbs"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hairColor">Hair Color</Label>
                      <Input
                        id="hairColor"
                        name="hairColor"
                        placeholder="e.g., Brown"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eyeColor">Eye Color</Label>
                      <Input
                        id="eyeColor"
                        name="eyeColor"
                        placeholder="e.g., Blue"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Input
                      id="ethnicity"
                      name="ethnicity"
                      placeholder="Enter ethnicity"
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications" // Added name attribute
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="emailNotifications">
                    Email notifications for new auditions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    name="smsNotifications" // Added name attribute
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="smsNotifications">
                    SMS notifications for urgent updates
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    name="marketingEmails" // Added name attribute
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="marketingEmails">
                    Receive marketing emails and newsletters
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} // This is the correct, final closing brace for the ProfilePage function
