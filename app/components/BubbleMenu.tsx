import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Highlighter } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type { Editor } from "@tiptap/react";

interface BubbleMenuProps {
  editor: Editor | null;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-1 p-1 rounded-lg border bg-background shadow-lg"
    >
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
        className={`w-8 h-8 p-0 ${editor.isActive("italic") ? "bg-muted" : ""}`}
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
    </TiptapBubbleMenu>
  );
};
