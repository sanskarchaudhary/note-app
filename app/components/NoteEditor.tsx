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
import { Save, Download } from "lucide-react";
import { Toolbar } from "./Toolbar";
import { SketchPad } from "./SketchPad";
import Heading from "@tiptap/extension-heading";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import BulletList from "@tiptap/extension-bullet-list";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { BubbleMenu } from "./BubbleMenu";
import CharacterCount from "@tiptap/extension-character-count";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import { WPMCounter } from "./WPMCounter";
import { motion, AnimatePresence } from "framer-motion";
import FontSize from "@tiptap/extension-font-size";

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
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
      }),
      Image,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "table"],
        alignments: ["left", "center", "right"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-4",
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Heading...";
          }
          return "Press '/' for commands...";
        },
      }),
      CharacterCount.configure({
        limit: null,
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
    ],
    content: note?.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
        spellcheck: "true",
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          // Handle file drops (images, etc.)
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            handleImageUpload(file);
            return true;
          }
        }
        return false;
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
      if (!user || !editor) return;

      try {
        // Validate file type and size
        if (!file.type.startsWith("image/")) {
          throw new Error("Please upload an image file");
        }

        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error("Image size should be less than 5MB");
        }

        // Show loading state
        setIsUploading(true);
        setSaveStatus("saving");

        // Upload to Firebase Storage
        const storage = getStorage();
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const storageRef = ref(storage, `images/${user.uid}/${fileName}`);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);

        // Insert image into editor
        editor
          .chain()
          .focus()
          .setImage({
            src: url,
            alt: file.name,
            title: file.name,
          })
          .run();

        setSaveStatus("saved");
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        setSaveStatus("error");
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [editor, user]
  );

  const handleSketchSave = useCallback(
    (dataUrl: string) => {
      editor?.chain().focus().setImage({ src: dataUrl }).run();
      setShowSketchPad(false);
    },
    [editor]
  );

  const WordCount = () => {
    const wordCount = editor?.storage.characterCount.words() ?? 0;
    const charCount = editor?.storage.characterCount.characters() ?? 0;

    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <span>{wordCount} words</span>
        <span>•</span>
        <span>{charCount} characters</span>
      </div>
    );
  };

  const handleDownloadPDF = async () => {
    if (!editor) return;

    const element = document.createElement("div");
    element.innerHTML = editor.getHTML();
    element.className = "prose max-w-none mx-auto p-8";

    const opt = {
      margin: 1,
      filename: `${title || "note"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

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
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-background rounded-lg shadow-lg overflow-hidden"
    >
      {/* Top Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 border-b"
      >
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
          <motion.span
            key={saveStatus}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm transition-colors duration-200 flex items-center gap-1"
            style={{ color: getSaveStatusColor() }}
          >
            {saveStatus === "saved" ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Save className="w-4 h-4" /> Saved
              </motion.div>
            ) : saveStatus === "saving" ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Saving...
              </motion.span>
            ) : (
              "Error saving"
            )}
          </motion.span>
        </div>
        <div className="flex items-center gap-2">
          {editor && (
            <WPMCounter editor={editor} isSaving={saveStatus === "saving"} />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadPDF}
            className="ml-2"
            title="Download as PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Toolbar
          editor={editor}
          onImageUpload={handleImageUpload}
          onSketchClick={() => setShowSketchPad(true)}
          isUploading={isUploading}
        />
      </motion.div>

      {editor && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <BubbleMenu editor={editor} />
        </motion.div>
      )}

      {/* Editor Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-grow overflow-auto relative"
      >
        <EditorContent
          editor={editor}
          className="h-full prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none font-cursive"
          style={{
            backgroundColor: getHslColor(currentTheme.background),
            color: getHslColor(currentTheme.text),
            padding: "2rem",
          }}
        />
      </motion.div>

      {/* Sketch Pad Modal */}
      <AnimatePresence>
        {showSketchPad && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <SketchPad
              onSave={handleSketchSave}
              onClose={() => setShowSketchPad(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between p-4 border-t"
      >
        <WordCount />
      </motion.div>
    </motion.div>
  );
};

export default NoteEditor;
