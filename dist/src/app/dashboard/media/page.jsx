"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MediaPage;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const sonner_1 = require("sonner");
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const dashboard_shell_1 = __importDefault(require("@/components/dashboard/dashboard-shell"));
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const image_1 = __importDefault(require("next/image"));
const tabs_1 = require("@/components/ui/tabs");
const dialog_1 = require("@/components/ui/dialog");
function MediaPage() {
    const router = (0, navigation_1.useRouter)();
    const fileInputRef = (0, react_1.useRef)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isUploading, setIsUploading] = (0, react_1.useState)(false);
    const [mediaItems, setMediaItems] = (0, react_1.useState)([]);
    const [selectedFile, setSelectedFile] = (0, react_1.useState)(null);
    const [previewUrl, setPreviewUrl] = (0, react_1.useState)(null);
    const [showImageDialog, setShowImageDialog] = (0, react_1.useState)(false);
    const [selectedImage, setSelectedImage] = (0, react_1.useState)(null);
    const [copied, setCopied] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        fetchMediaItems();
    }, []);
    (0, react_1.useEffect)(() => {
        if (selectedFile) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(selectedFile);
        }
        else {
            setPreviewUrl(null);
        }
    }, [selectedFile]);
    const fetchMediaItems = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setIsLoading(true);
            const response = yield fetch("/api/media");
            if (!response.ok) {
                throw new Error("Failed to fetch media items");
            }
            const data = yield response.json();
            setMediaItems(data.media);
        }
        catch (error) {
            console.error("Error fetching media:", error);
            sonner_1.toast.error("Failed to load media items");
        }
        finally {
            setIsLoading(false);
        }
    });
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (!file.type.startsWith("image/")) {
                sonner_1.toast.error("Only image files are allowed");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                sonner_1.toast.error("File size must be less than 5MB");
                return;
            }
            setSelectedFile(file);
        }
    };
    const handleUpload = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedFile) {
            sonner_1.toast.error("Please select a file to upload");
            return;
        }
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = yield fetch("/api/media/upload", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Failed to upload file");
            }
            sonner_1.toast.success("File uploaded successfully");
            setSelectedFile(null);
            fetchMediaItems();
        }
        catch (error) {
            console.error("Error uploading file:", error);
            sonner_1.toast.error("Failed to upload file");
        }
        finally {
            setIsUploading(false);
        }
    });
    const openFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowImageDialog(true);
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            sonner_1.toast.success("Copied to clipboard");
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }, (err) => {
            sonner_1.toast.error("Failed to copy text");
        });
    };
    const formatFileSize = (bytes) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        }
        else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        else {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
    };
    return (<dashboard_shell_1.default>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <button_1.Button onClick={openFileInput} disabled={isUploading}>
          {isUploading ? (<>
              <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Uploading...
            </>) : (<>
              <lucide_react_1.UploadCloud className="mr-2 h-4 w-4"/>
              Upload
            </>)}
        </button_1.Button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>
      </div>

      <tabs_1.Tabs defaultValue="library" className="w-full">
        <tabs_1.TabsList className="mb-6">
          <tabs_1.TabsTrigger value="library">Media Library</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="upload">Upload New</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="library" className="w-full">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Media Library</card_1.CardTitle>
              <card_1.CardDescription>
                All uploaded images available for use in your posts.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              {isLoading ? (<div className="flex justify-center py-12">
                  <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                </div>) : mediaItems.length === 0 ? (<div className="flex flex-col items-center justify-center py-12 text-center">
                  <lucide_react_1.Image className="h-12 w-12 text-muted-foreground/60 mb-4"/>
                  <h3 className="text-lg font-medium">No media uploaded yet</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    Upload images to use in your blog posts.
                  </p>
                  <button_1.Button onClick={openFileInput}>
                    Upload your first image
                  </button_1.Button>
                </div>) : (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaItems.map((item) => (<div key={item.id} className="group relative aspect-square rounded-md border overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary" onClick={() => handleImageClick(item)}>
                      <image_1.default src={item.thumbnailUrl || item.url} alt={item.filename} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                        <span className="px-2 text-center">
                          {item.width} x {item.height}
                        </span>
                      </div>
                    </div>))}
                </div>)}
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="upload" className="w-full">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Upload New Image</card_1.CardTitle>
              <card_1.CardDescription>
                Upload images to use in your blog posts and pages.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="flex flex-col items-center justify-center">
                {previewUrl ? (<div className="relative w-full max-w-md mb-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <image_1.default src={previewUrl} alt="Preview" fill className="object-contain"/>
                    </div>
                    <button_1.Button variant="outline" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background" onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
            }}>
                      <lucide_react_1.X className="h-4 w-4"/>
                    </button_1.Button>
                  </div>) : (<div onClick={openFileInput} className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors mb-4">
                    <lucide_react_1.UploadCloud className="h-10 w-10 text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground text-center">
                      Drag and drop your image here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports: JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>)}

                <div className="flex gap-4 mt-4">
                  <button_1.Button variant="outline" onClick={openFileInput}>
                    Choose File
                  </button_1.Button>
                  <button_1.Button disabled={!selectedFile || isUploading} onClick={handleUpload}>
                    {isUploading ? (<>
                        <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Uploading...
                      </>) : ("Upload")}
                  </button_1.Button>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>

      <dialog_1.Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        {selectedImage && (<dialog_1.DialogContent className="sm:max-w-md">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>{selectedImage.filename}</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                Uploaded on{" "}
                {new Date(selectedImage.createdAt).toLocaleDateString()}
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>
            <div className="relative aspect-video mb-4">
              <image_1.default src={selectedImage.url} alt={selectedImage.filename} fill className="object-contain rounded-md" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Size:</div>
                <div>{formatFileSize(selectedImage.size)}</div>
                <div className="text-muted-foreground">Dimensions:</div>
                <div>
                  {selectedImage.width} × {selectedImage.height}px
                </div>
                <div className="text-muted-foreground">Type:</div>
                <div>{selectedImage.type}</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <label_1.Label htmlFor="imageUrl">Image URL</label_1.Label>
                  <div className="flex">
                    <input_1.Input id="imageUrl" defaultValue={selectedImage.url} readOnly className="flex-1"/>
                    <button_1.Button type="submit" size="sm" className="ml-2" onClick={() => copyToClipboard(selectedImage.url)}>
                      <lucide_react_1.Copy className="h-4 w-4"/>
                    </button_1.Button>
                  </div>
                </div>
              </div>
            </div>
            <dialog_1.DialogFooter className="sm:justify-start">
              <button_1.Button type="button" variant="secondary" onClick={() => window.open(selectedImage.url, "_blank")}>
                <lucide_react_1.ExternalLink className="mr-2 h-4 w-4"/>
                Open
              </button_1.Button>
            </dialog_1.DialogFooter>
          </dialog_1.DialogContent>)}
      </dialog_1.Dialog>
    </dashboard_shell_1.default>);
}
