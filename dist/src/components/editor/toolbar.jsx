"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Toolbar;
const lucide_react_1 = require("lucide-react");
const toggle_1 = require("@/components/ui/toggle");
const button_1 = require("@/components/ui/button");
const popover_1 = require("@/components/ui/popover");
const input_1 = require("@/components/ui/input");
const react_1 = require("react");
function Toolbar({ editor }) {
    const [isLinkPopoverOpen, setIsLinkPopoverOpen] = (0, react_1.useState)(false);
    const [linkUrl, setLinkUrl] = (0, react_1.useState)("");
    const [isImagePopoverOpen, setIsImagePopoverOpen] = (0, react_1.useState)(false);
    const [imageUrl, setImageUrl] = (0, react_1.useState)("");
    const [imageAlt, setImageAlt] = (0, react_1.useState)("");
    const setLink = () => {
        if (!linkUrl)
            return;
        // Empty
        if (linkUrl === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        // Update link
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: linkUrl })
            .run();
        setLinkUrl("");
        setIsLinkPopoverOpen(false);
    };
    const addImage = () => {
        if (!imageUrl)
            return;
        editor
            .chain()
            .focus()
            .setImage({ src: imageUrl, alt: imageAlt || "Image" })
            .run();
        setImageUrl("");
        setImageAlt("");
        setIsImagePopoverOpen(false);
    };
    if (!editor) {
        return null;
    }
    return (<div className="border border-input bg-transparent rounded-t-md">
      <div className="flex flex-wrap gap-1 p-1">
        <toggle_1.Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <lucide_react_1.Bold className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <lucide_react_1.Italic className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive("underline")} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
          <lucide_react_1.Underline className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
          <lucide_react_1.Strikethrough className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive("code")} onPressedChange={() => editor.chain().focus().toggleCode().run()}>
          <lucide_react_1.Code className="h-4 w-4"/>
        </toggle_1.Toggle>

        <div className="w-px h-6 bg-border mx-1 my-auto"/>

        <toggle_1.Toggle size="sm" pressed={editor.isActive("heading", { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <lucide_react_1.Heading1 className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive("heading", { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <lucide_react_1.Heading2 className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive("heading", { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <lucide_react_1.Heading3 className="h-4 w-4"/>
        </toggle_1.Toggle>

        <div className="w-px h-6 bg-border mx-1 my-auto"/>

        <toggle_1.Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <lucide_react_1.List className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
          <lucide_react_1.ListOrdered className="h-4 w-4"/>
        </toggle_1.Toggle>

        <div className="w-px h-6 bg-border mx-1 my-auto"/>

        <toggle_1.Toggle size="sm" pressed={editor.isActive({ textAlign: "left" })} onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}>
          <lucide_react_1.AlignLeft className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive({ textAlign: "center" })} onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}>
          <lucide_react_1.AlignCenter className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive({ textAlign: "right" })} onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}>
          <lucide_react_1.AlignRight className="h-4 w-4"/>
        </toggle_1.Toggle>
        <toggle_1.Toggle size="sm" pressed={editor.isActive({ textAlign: "justify" })} onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}>
          <lucide_react_1.AlignJustify className="h-4 w-4"/>
        </toggle_1.Toggle>

        <div className="w-px h-6 bg-border mx-1 my-auto"/>

        <popover_1.Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <popover_1.PopoverTrigger asChild>
            <toggle_1.Toggle size="sm" pressed={editor.isActive("link")}>
              <lucide_react_1.Link className="h-4 w-4"/>
            </toggle_1.Toggle>
          </popover_1.PopoverTrigger>
          <popover_1.PopoverContent className="w-80 p-3">
            <div className="flex flex-col gap-2">
              <div className="grid gap-1.5">
                <label htmlFor="link-url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  URL
                </label>
                <input_1.Input id="link-url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="col-span-3"/>
              </div>
              <div className="flex justify-end gap-2">
                <button_1.Button variant="outline" size="sm" onClick={() => setIsLinkPopoverOpen(false)}>
                  Cancel
                </button_1.Button>
                <button_1.Button size="sm" onClick={setLink}>
                  Save
                </button_1.Button>
              </div>
            </div>
          </popover_1.PopoverContent>
        </popover_1.Popover>

        <popover_1.Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
          <popover_1.PopoverTrigger asChild>
            <toggle_1.Toggle size="sm">
              <lucide_react_1.Image className="h-4 w-4"/>
            </toggle_1.Toggle>
          </popover_1.PopoverTrigger>
          <popover_1.PopoverContent className="w-80 p-3">
            <div className="flex flex-col gap-2">
              <div className="grid gap-1.5">
                <label htmlFor="image-url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Image URL
                </label>
                <input_1.Input id="image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="col-span-3"/>
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="image-alt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Alt Text
                </label>
                <input_1.Input id="image-alt" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Image description" className="col-span-3"/>
              </div>
              <div className="flex justify-end gap-2">
                <button_1.Button variant="outline" size="sm" onClick={() => setIsImagePopoverOpen(false)}>
                  Cancel
                </button_1.Button>
                <button_1.Button size="sm" onClick={addImage}>
                  Add Image
                </button_1.Button>
              </div>
            </div>
          </popover_1.PopoverContent>
        </popover_1.Popover>
      </div>
    </div>);
}
