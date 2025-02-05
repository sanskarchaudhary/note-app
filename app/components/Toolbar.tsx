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
  Table as TableIcon,
  Plus,
  Minus,
  Trash2,
  Loader2,
  Type,
  Smile,
  GripHorizontal,
  Square,
} from "lucide-react";
import { AIAssistant } from "./AIAssistant";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FontSelector } from "./FontSelector";

interface ToolbarProps {
  editor: Editor | null;
  onImageUpload: (file: File) => void;
  onSketchClick: () => void;
  isUploading?: boolean;
}

interface TableControlsProps {
  editor: Editor;
}

const TableControls: React.FC<TableControlsProps> = ({ editor }) => {
  if (!editor.isActive("table")) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        className="w-8 h-8 p-0"
        title="Add Column Before"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        className="w-8 h-8 p-0"
        title="Add Column After"
      >
        <Plus className="h-4 w-4 rotate-90" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        className="w-8 h-8 p-0"
        title="Delete Column"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="h-8 w-px bg-gray-200 mx-2"></div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().addRowBefore().run()}
        className="w-8 h-8 p-0"
        title="Add Row Before"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        className="w-8 h-8 p-0"
        title="Add Row After"
      >
        <Plus className="h-4 w-4 rotate-90" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().deleteRow().run()}
        className="w-8 h-8 p-0"
        title="Delete Row"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <ToolbarDivider />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().deleteTable().run()}
        className="w-8 h-8 p-0"
        title="Delete Table"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Add font size options
const FONT_SIZES = [
  { label: "Small", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Large", value: "20px" },
  { label: "Huge", value: "24px" },
];

// Add emoji picker component
const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
  const COMMON_EMOJIS = [
    "😊",
    "👍",
    "💡",
    "⭐",
    "📌",
    "✅",
    "❌",
    "💪",
    "🎯",
    "📝",
  ];

  return (
    <div className="grid grid-cols-5 gap-2 p-2">
      {COMMON_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="hover:bg-muted p-1 rounded"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

// Add after FONT_SIZES constant
const SHAPES = [
  {
    label: "Rectangle",
    svg: `<rect x="10" y="20" width="80" height="60" rx="2" fill="currentColor"/>`,
  },
  {
    label: "Circle",
    svg: `<circle cx="50" cy="50" r="35" fill="currentColor"/>`,
  },
  {
    label: "Triangle",
    svg: `<polygon points="50,15 85,80 15,80" fill="currentColor"/>`,
  },
  {
    label: "Star",
    svg: `<path d="M50,15 L63,45 95,45 69,64 79,95 50,77 21,95 31,64 5,45 37,45 Z" fill="currentColor"/>`,
  },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  onImageUpload,
  onSketchClick,
  isUploading,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const insertDivider = (size: "small" | "medium" | "large") => {
    const heights = { small: "1px", medium: "2px", large: "4px" };
    editor.chain().focus().setHorizontalRule().run();
    const hr = editor.view.dom.querySelector("hr:last-of-type") as HTMLElement;
    if (hr) {
      hr.style.height = heights[size];
    }
  };

  const insertShape = (shapeSvg: string) => {
    if (!editor) return;
    const svg = `
      <div style="display: inline-block; margin: 4px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40" style="vertical-align: middle;">
          ${shapeSvg}
        </svg>
      </div>
    `;
    editor.chain().focus().insertContent(svg).run();
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
      <ToolbarGroup>
        <AIAssistant editor={editor} />
      </ToolbarGroup>

      <ToolbarDivider />

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
          className="w-8 h-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="w-8 h-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 p-0"
        >
          <FileImage className="h-4 w-4" />
        </Button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onImageUpload(e.target.files[0]);
            }
          }}
          ref={fileInputRef}
          className="hidden"
        />
        {isUploading && (
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        )}
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSketchClick}
          className="w-8 h-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().insertTable().run()}
          className={`w-8 h-8 p-0 ${
            editor.isActive("table") ? "bg-muted" : ""
          }`}
        >
          <TableIcon className="h-4 w-4" />
        </Button>
        {editor.isActive("table") && <TableControls editor={editor} />}
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Font Size Controls */}
      <ToolbarGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-1">
              {FONT_SIZES.map(({ label, value }) => (
                <Button
                  key={value}
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    editor.chain().focus().setFontSize(value).run()
                  }
                  className={
                    editor.isActive({ fontSize: value }) ? "bg-muted" : ""
                  }
                >
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Shape Controls */}
      <ToolbarGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Square className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-1">
              {SHAPES.map(({ label, svg }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  onClick={() => insertShape(svg)}
                  className="flex items-center gap-2"
                >
                  <svg
                    viewBox="0 0 100 100"
                    width="24"
                    height="24"
                    className="text-foreground"
                  >
                    <g dangerouslySetInnerHTML={{ __html: svg }} />
                  </svg>
                  <span>{label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Emoji Picker */}
      <ToolbarGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <EmojiPicker
              onSelect={(emoji) => {
                editor.chain().focus().insertContent(emoji).run();
              }}
            />
          </PopoverContent>
        </Popover>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Line Controls */}
      <ToolbarGroup>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              <GripHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertDivider("small")}
              >
                Thin Line
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertDivider("medium")}
              >
                Medium Line
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertDivider("large")}
              >
                Thick Line
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <FontSelector editor={editor} />
      </ToolbarGroup>
    </div>
  );
};

// Add these back at the bottom of the file
const ToolbarGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="flex items-center gap-1 px-2">{children}</div>;

const ToolbarDivider = () => <div className="w-px h-4 bg-border" />;
