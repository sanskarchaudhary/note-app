import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useTheme } from "../../contexts/ThemeContext";
import type { Note } from "../page";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { Toolbar } from "./Toolbar";
import { SketchPad } from "./SketchPad";
import Heading from "@tiptap/extension-heading";

type NoteEditorProps = {
  note: Note | null;
  updateNote: (id: string, title: string, content: string) => void;
};

const NoteEditor: React.FC<NoteEditorProps> = ({ note, updateNote }) => {
  const { currentTheme } = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState(note?.title || "");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const [showSketchPad, setShowSketchPad] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(note?.content || "");
  const [lastSavedTitle, setLastSavedTitle] = useState(note?.title || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // We'll configure it separately
      }),
      Image,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Heading...";
          }
          return "Press '/' for commands...";
        },
      }),
    ],
    content: note?.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      debouncedSave(title, content);
    },
  });

  // Debounced save function
  const debouncedSave = useCallback(
    async (newTitle: string, newContent: string) => {
      if (!user || !note || !note.id) return;
      if (newTitle === lastSavedTitle && newContent === lastSavedContent)
        return;

      try {
        setSaveStatus("saving");
        await updateDoc(doc(db, "notes", note.id), {
          title: newTitle,
          content: newContent,
          updatedAt: new Date().toISOString(),
        });
        updateNote(note.id, newTitle, newContent);
        setLastSavedContent(newContent);
        setLastSavedTitle(newTitle);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Error saving note:", error);
        setSaveStatus("error");
      }
    },
    [user, note, updateNote, lastSavedContent, lastSavedTitle]
  );

  // Auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSave(title, editor?.getHTML() || "");
    }, 1000); // Save after 1 second of no typing

    return () => clearTimeout(timeoutId);
  }, [title, debouncedSave, editor]);

  // Reset states when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setLastSavedTitle(note.title);
      setLastSavedContent(note.content);
      editor?.commands.setContent(note.content);
    }
  }, [note, editor]);

  const getHslColor = (colorStr: string) => {
    // Handle both HSL format and direct color names
    return colorStr.includes(" ") ? `hsl(${colorStr})` : colorStr;
  };

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        // Temporary solution - convert to data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          editor?.chain().focus().setImage({ src: dataUrl }).run();
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    [editor]
  );

  const handleSketchSave = useCallback(
    (dataUrl: string) => {
      editor?.chain().focus().setImage({ src: dataUrl }).run();
      setShowSketchPad(false);
    },
    [editor]
  );

  if (!note) {
    return (
      <div
        className="h-full flex items-center justify-center opacity-50"
        style={{ color: getHslColor(currentTheme.text) }}
      >
        Select a note or create a new one
      </div>
    );
  }

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case "saved":
        return getHslColor(currentTheme.accent);
      case "saving":
        return getHslColor("45 100% 50%"); // warm yellow
      case "error":
        return getHslColor("0 100% 50%"); // red
      default:
        return getHslColor(currentTheme.text);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-lg">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center flex-grow gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl font-medium border-none flex-grow max-w-[50%]"
            style={{
              backgroundColor: getHslColor(currentTheme.background),
              color: getHslColor(currentTheme.text),
            }}
          />
          <span
            className="text-sm transition-colors duration-200 flex items-center gap-1"
            style={{ color: getSaveStatusColor() }}
          >
            {saveStatus === "saved" ? (
              <>
                <Save className="w-4 h-4" /> Saved
              </>
            ) : saveStatus === "saving" ? (
              "Saving..."
            ) : (
              "Error saving"
            )}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        editor={editor}
        onImageUpload={handleImageUpload}
        onSketchClick={() => setShowSketchPad(true)}
      />

      {/* Editor Area */}
      <div className="flex-grow overflow-auto p-4">
        <EditorContent
          editor={editor}
          className="h-full prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
          style={{
            backgroundColor: getHslColor(currentTheme.background),
            color: getHslColor(currentTheme.text),
          }}
        />
      </div>

      {/* Sketch Pad Modal */}
      {showSketchPad && (
        <SketchPad
          onSave={handleSketchSave}
          onClose={() => setShowSketchPad(false)}
        />
      )}
    </div>
  );
};

export default NoteEditor;
