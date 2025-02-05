import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Type } from "lucide-react";
import { Editor } from "@tiptap/react";
import { ScrollArea } from "./ui/scroll-area";

const FONTS = [
  // Standard Fonts
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Calibri", value: "Calibri, sans-serif" },
  { label: "Cambria", value: "Cambria, Georgia, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
  { label: "Impact", value: "Impact, Charcoal, sans-serif" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Book Antiqua", value: "'Book Antiqua', Palatino, serif" },
  { label: "Century Gothic", value: "'Century Gothic', sans-serif" },
  // Handwriting Fonts
  { label: "Handwriting", value: "var(--font-handwriting)" },
  { label: "Cursive", value: "var(--font-cursive)" },
  { label: "Casual", value: "var(--font-casual)" },
];

interface FontSelectorProps {
  editor: Editor | null;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ editor }) => {
  if (!editor) return null;

  const setFontFamily = (fontFamily: string) => {
    editor
      .chain()
      .focus()
      .setMark("textStyle", { style: `font-family: ${fontFamily}` })
      .run();
  };

  const getCurrentFont = () => {
    const attrs = editor.getAttributes("textStyle");
    return attrs?.style?.match(/font-family: ([^;]+)/)?.[1] || "Font";
  };

  const isActive = (fontFamily: string) => {
    return editor.isActive("textStyle", {
      style: `font-family: ${fontFamily}`,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="w-32 justify-start gap-2">
          <Type className="h-4 w-4" />
          <span className="truncate" style={{ fontFamily: getCurrentFont() }}>
            {getCurrentFont()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <ScrollArea className="h-80">
          <div className="flex flex-col gap-1 p-2">
            {FONTS.map(({ label, value }) => (
              <Button
                key={value}
                variant="ghost"
                size="sm"
                onClick={() => setFontFamily(value)}
                className={`justify-start h-8 ${
                  isActive(value) ? "bg-muted" : ""
                }`}
                style={{ fontFamily: value }}
              >
                {label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
