import * as React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  FileImage,
  Pencil,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
  onImageUpload: (file: File) => void;
  onSketchClick: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  onImageUpload,
  onSketchClick,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
      <ToolbarGroup>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`w-8 h-8 p-0 ${editor.isActive("bold") ? "bg-muted" : ""}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive("italic") ? "bg-muted" : ""
          }`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive("underline") ? "bg-muted" : ""
          }`}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive("highlight") ? "bg-muted" : ""
          }`}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive({ textAlign: "left" }) ? "bg-muted" : ""
          }`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive({ textAlign: "center" }) ? "bg-muted" : ""
          }`}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive({ textAlign: "right" }) ? "bg-muted" : ""
          }`}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive("bulletList") ? "bg-muted" : ""
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive("orderedList") ? "bg-muted" : ""
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive("blockquote") ? "bg-muted" : ""
          }`}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="w-8 h-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="w-8 h-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageUpload(file);
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 p-0"
        >
          <FileImage className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSketchClick}
          className="w-8 h-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </ToolbarGroup>
    </div>
  );
};

const ToolbarGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="flex items-center gap-1 px-2">{children}</div>;

const ToolbarDivider = () => <div className="w-px h-4 bg-border" />;
