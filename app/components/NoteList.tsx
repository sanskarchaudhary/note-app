import type React from "react";
import type { Note } from "../page";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

type NoteListProps = {
  notes: Note[];
  deleteNote: (id: string) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
};

const NoteList: React.FC<NoteListProps> = ({
  deleteNote,
  selectedNote,
  setSelectedNote,
}) => {
  const { currentTheme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-2 rounded cursor-pointer flex justify-between items-center ${
            selectedNote && selectedNote.id === note.id
              ? `bg-${currentTheme.accent} bg-opacity-20`
              : `hover:bg-${currentTheme.secondary} hover:bg-opacity-10`
          }`}
          onClick={() => setSelectedNote(note)}
        >
          <div className="flex-1 truncate">
            <p className={`font-medium text-${currentTheme.text}`}>
              {note.title || note.content.split("\n")[0] || "Untitled Note"}
            </p>
            <p className={`text-sm text-${currentTheme.text} opacity-60`}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(note.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
