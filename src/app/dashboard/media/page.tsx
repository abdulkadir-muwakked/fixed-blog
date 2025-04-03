"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  X,
  Copy,
  ExternalLink,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  width: number;
  height: number;
  type: string;
  createdAt: string;
};

export default function MediaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const fetchMediaItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/media");

      if (!response.ok) {
        throw new Error("Failed to fetch media items");
      }

      const data = await response.json();
      setMediaItems(data.media);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      toast.success("File uploaded successfully");
      setSelectedFile(null);

      // Refresh media list
      fetchMediaItems();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageClick = (image: MediaItem) => {
    setSelectedImage(image);
    setShowImageDialog(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        toast.success("Copied to clipboard");

        // Reset copy status after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        toast.error("Failed to copy text");
      }
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <Button onClick={openFileInput} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <Tabs defaultValue="library">
        <TabsList className="mb-6">
          <TabsTrigger value="library">Media Library</TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                All uploaded images available for use in your posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/60 mb-4" />
                  <h3 className="text-lg font-medium">No media uploaded yet</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    Upload images to use in your blog posts.
                  </p>
                  <Button onClick={openFileInput}>Upload your first image</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square rounded-md border overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary"
                      onClick={() => handleImageClick(item)}
                    >
                      <Image
                        src={item.thumbnailUrl || item.url}
                        alt={item.filename}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                        <span className="px-2 text-center">
                          {item.width} x {item.height}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
              <CardDescription>
                Upload images to use in your blog posts and pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="relative w-full max-w-md mb-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={openFileInput}
                    className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors mb-4"
                  >
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-center">
                      Drag and drop your image here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports: JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>
                )}

                <div className="flex gap-4 mt-4">
                  <Button variant="outline" onClick={openFileInput}>
                    Choose File
                  </Button>
                  <Button
                    disabled={!selectedFile || isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Details Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        {selectedImage && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedImage.filename}</DialogTitle>
              <DialogDescription>
                Uploaded on {new Date(selectedImage.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video mb-4">
              <Image
                src={selectedImage.url}
                alt={selectedImage.filename}
                fill
                className="object-contain rounded-md"
              />
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Size:</div>
                <div>{formatFileSize(selectedImage.size)}</div>
                <div className="text-muted-foreground">Dimensions:</div>
                <div>{selectedImage.width} × {selectedImage.height}px</div>
                <div className="text-muted-foreground">Type:</div>
                <div>{selectedImage.type}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <div className="flex">
                    <Input
                      id="imageUrl"
                      defaultValue={selectedImage.url}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="ml-2"
                      onClick={() => copyToClipboard(selectedImage.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.open(selectedImage.url, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </DashboardShell>
  );
}
