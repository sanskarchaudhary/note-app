import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Type } from "lucide-react";
import { Editor } from "@tiptap/react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { useState } from "react";

type FontCategory = "Recent" | "All Fonts" | "Handwriting";
type FontGroups = Record<FontCategory, Array<{ label: string; value: string }>>;

const FONTS: FontGroups = {
  Recent: [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
    { label: "Calibri", value: "Calibri, sans-serif" },
  ],
  "All Fonts": [
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
  ],
  Handwriting: [
    { label: "Handwriting", value: "var(--font-handwriting)" },
    { label: "Cursive", value: "var(--font-cursive)" },
    { label: "Casual", value: "var(--font-casual)" },
  ],
};

interface FontSelectorProps {
  editor: Editor | null;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ editor }) => {
  const [search, setSearch] = useState("");
  if (!editor) return null;

  const setFontFamily = (fontFamily: string) => {
    // First unset any existing font-family
    editor.chain().focus().unsetMark("textStyle").run();

    // Then apply the new font-family
    editor
      .chain()
      .focus()
      .setMark("textStyle", {
        style: `font-family: ${fontFamily}`,
      })
      .run();

    // Update recent fonts
    const recentFont = FONTS["All Fonts"].find((f) => f.value === fontFamily);
    if (recentFont && !FONTS.Recent.includes(recentFont)) {
      FONTS.Recent = [recentFont, ...FONTS.Recent.slice(0, 4)];
    }
  };

  const getCurrentFont = () => {
    const attrs = editor.getAttributes("textStyle");
    const fontFamily = attrs?.style?.match(/font-family: ([^;]+)/)?.[1];
    if (!fontFamily) return "Font";

    const font = Object.values(FONTS)
      .flat()
      .find((f) => f.value === fontFamily);
    return font?.label || fontFamily;
  };

  const filteredFonts = Object.entries(FONTS).reduce(
    (acc, [category, fonts]) => {
      const filtered = fonts.filter((font) =>
        font.label.toLowerCase().includes(search.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category as FontCategory] = filtered;
      }
      return acc;
    },
    {} as typeof FONTS
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="w-40 justify-start gap-2">
          <Type className="h-4 w-4" />
          <span className="truncate" style={{ fontFamily: getCurrentFont() }}>
            {getCurrentFont()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <Input
            placeholder="Search fonts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {Object.entries(filteredFonts).map(([category, fonts]) => (
                <div key={category}>
                  <div className="px-2 text-xs font-medium text-muted-foreground mb-2">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {fonts.map(({ label, value }) => (
                      <Button
                        key={value}
                        variant="ghost"
                        size="sm"
                        onClick={() => setFontFamily(value)}
                        className="w-full justify-start h-8 hover:bg-muted"
                        style={{ fontFamily: value }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
