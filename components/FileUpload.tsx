"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, FileText, Image } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FileUploadProps {
  bucketName: string;
  folder?: string;
  acceptedTypes: string;
  label: string;
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
}

export function FileUpload({
  bucketName,
  folder = "",
  acceptedTypes,
  label,
  onUploadComplete,
  currentUrl
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);

      toast({
        title: "Success",
        description: "File uploaded successfully!",
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = acceptedTypes.split(',').map(type => type.trim());
    const isValidType = validTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      if (type === 'application/pdf') return file.type === 'application/pdf';
      return file.type === type;
    });

    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: `Please select a valid file type: ${acceptedTypes}`,
        variant: "destructive",
      });
      return;
    }

    await uploadFile(file);
  };

  const removeFile = () => {
    setPreviewUrl("");
    onUploadComplete("");
  };

  const getFileIcon = (url: string) => {
    if (url.includes('.pdf')) return <FileText className="h-8 w-8" />;
    return <Image className="h-8 w-8" />;
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="flex items-center gap-2 p-2 border rounded-md">
          {previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-12 w-12 object-cover rounded"
            />
          ) : (
            <div className="h-12 w-12 flex items-center justify-center border rounded bg-muted">
              {getFileIcon(previewUrl)}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">File uploaded</p>
            <p className="text-xs text-muted-foreground">
              {previewUrl.split('/').pop()}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept={acceptedTypes}
              onChange={handleFileSelect}
              disabled={uploading}
              className="cursor-pointer"
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => document.querySelector(`input[type="file"]`)?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          
          {uploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
