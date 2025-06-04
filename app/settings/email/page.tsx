"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Mail, Plus, Trash } from "lucide-react";

interface FilterRule {
  field: string;
  contains: string;
}

interface EmailSettings {
  enabled: boolean;
  forwardingAddress: string;
  filterRules: FilterRule[];
}

export default function EmailSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<EmailSettings>({
    enabled: false,
    forwardingAddress: "",
    filterRules: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/email/settings");
        if (!response.ok) throw new Error("Failed to load settings");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load email settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/email/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      toast({
        title: "Success",
        description: "Email settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFilterRule = () => {
    setSettings(prev => ({
      ...prev,
      filterRules: [...prev.filterRules, { field: "from", contains: "" }],
    }));
  };

  const removeFilterRule = (index: number) => {
    setSettings(prev => ({
      ...prev,
      filterRules: prev.filterRules.filter((_, i) => i !== index),
    }));
  };

  const updateFilterRule = (index: number, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      filterRules: prev.filterRules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Email Settings</h2>
        <p className="text-muted-foreground">
          Configure automatic audition imports from email
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Email Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Email Integration</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create auditions from casting emails
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, enabled: checked }))
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Forwarding Address</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={settings.forwardingAddress}
                  disabled
                  className="font-mono"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Forward casting emails to this address to automatically create auditions
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email Filters</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFilterRule}
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Filter
                </Button>
              </div>

              <div className="space-y-2">
                {settings.filterRules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      className="rounded-md border p-2"
                      value={rule.field}
                      onChange={(e) =>
                        updateFilterRule(index, "field", e.target.value)
                      }
                      disabled={isLoading}
                    >
                      <option value="from">From</option>
                      <option value="subject">Subject</option>
                    </select>
                    <Input
                      value={rule.contains}
                      onChange={(e) =>
                        updateFilterRule(index, "contains", e.target.value)
                      }
                      placeholder="Contains text..."
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFilterRule(index)}
                      disabled={isLoading}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}