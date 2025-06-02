"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from "react-dropzone";
import {
  ChevronLeftIcon,
  FileSpreadsheetIcon,
  TableIcon,
  UploadIcon,
} from "lucide-react";

export default function ImportAuditionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [airtableApiKey, setAirtableApiKey] = useState("");
  const [airtableBaseId, setAirtableBaseId] = useState("");
  const [airtableTableName, setAirtableTableName] = useState("");

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Here we would handle the file upload and processing
      toast({
        title: "File received",
        description: "Processing your spreadsheet...",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.google-apps.spreadsheet": [".gsheet"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const handleAirtableImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/import/airtable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: airtableApiKey,
          baseId: airtableBaseId,
          tableName: airtableTableName,
        }),
      });

      if (!response.ok) throw new Error("Import failed");

      toast({
        title: "Success!",
        description: "Your Airtable data has been imported successfully.",
      });
      
      router.push("/auditions");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data from Airtable. Please try again.",
        variant: "destructive",
      });
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
          <h2 className="text-3xl font-bold tracking-tight">Import Auditions</h2>
          <p className="text-muted-foreground">
            Import your existing audition tracking data
          </p>
        </div>
      </div>

      <Tabs defaultValue="spreadsheet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spreadsheet">
            <FileSpreadsheetIcon className="mr-2 h-4 w-4" />
            Spreadsheet
          </TabsTrigger>
          <TabsTrigger value="airtable">
            <TableIcon className="mr-2 h-4 w-4" />
            Airtable
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spreadsheet">
          <Card>
            <CardHeader>
              <CardTitle>Upload Spreadsheet</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors ${
                  isDragActive ? "border-primary bg-secondary/50" : "border-border"
                }`}
              >
                <input {...getInputProps()} />
                <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Drag and drop your spreadsheet here, or click to select a file
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Supports Excel, Google Sheets exports, and CSV files
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="airtable">
          <Card>
            <CardHeader>
              <CardTitle>Connect Airtable</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAirtableImport} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Airtable API Key</Label>
                  <Input
                    id="apiKey"
                    value={airtableApiKey}
                    onChange={(e) => setAirtableApiKey(e.target.value)}
                    placeholder="Enter your Airtable API key"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseId">Base ID</Label>
                  <Input
                    id="baseId"
                    value={airtableBaseId}
                    onChange={(e) => setAirtableBaseId(e.target.value)}
                    placeholder="Enter your Airtable base ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tableName">Table Name</Label>
                  <Input
                    id="tableName"
                    value={airtableTableName}
                    onChange={(e) => setAirtableTableName(e.target.value)}
                    placeholder="Enter your table name"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Import from Airtable
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}