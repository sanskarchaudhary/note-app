import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Type } from "lucide-react";
import { Editor } from "@tiptap/react";

const FONTS = [
  { label: "Handwriting", value: "font-handwriting" },
  { label: "Cursive", value: "font-cursive" },
  { label: "Casual", value: "font-casual" },
];

interface FontSelectorProps {
  editor: Editor | null;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ editor }) => {
  if (!editor) return null;

  const setFontFamily = (fontClass: string) => {
    editor.chain().focus().setMark("textStyle", { class: fontClass }).run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
          <Type className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="flex flex-col gap-1">
          {FONTS.map(({ label, value }) => (
            <Button
              key={value}
              variant="ghost"
              size="sm"
              onClick={() => setFontFamily(value)}
              className={value}
            >
              {label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
