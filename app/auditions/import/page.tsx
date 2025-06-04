"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { ChevronLeftIcon, FileSpreadsheetIcon, UploadIcon } from "lucide-react";

export default function ImportAuditionsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      toast({
        title: "File received",
        description: "Processing your spreadsheet...",
      });
      
      // Here you would handle the file processing
      // For now, just show a success message
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Your auditions have been imported successfully!",
        });
        router.push("/auditions");
      }, 2000);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

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
              Supports Excel and CSV files
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}