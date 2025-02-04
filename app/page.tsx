"use client";

import { useEffect, useState } from "react";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import ThemeSelector from "./components/ThemeSelector";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, User } from "lucide-react";
import CustomThemeModal from "./components/CustomThemeModal";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: string;
};

export default function Home() {
  const { user, signOut } = useAuth();
  const { currentTheme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCustomThemeModalOpen, setIsCustomThemeModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      const notesCollection = collection(db, "notes");
      const q = query(
        notesCollection,
        where("userId", "==", user.uid),
        orderBy("updatedAt", "desc")
      );
      const notesSnapshot = await getDocs(q);
      const fetchedNotes = notesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Note)
      );
      setNotes(fetchedNotes);
    };

    fetchNotes();
  }, [user]);

  if (!user) {
    return <LoginPage />;
  }

  const addNote = async () => {
    const newNote = {
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.uid,
      status: "pending",
    };
    const docRef = await addDoc(collection(db, "notes"), newNote);
    setNotes((prev) => [...prev, { id: docRef.id, ...newNote }]);
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(db, "notes", id));
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    await updateDoc(doc(db, "notes", id), {
      title,
      content,
      updatedAt: new Date().toISOString(),
    });
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, title, content } : note))
    );
  };

  return (
    <div className="note-paper">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-2xl font-bold text-${currentTheme.primary}`}>
            Notes
          </h1>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {user.displayName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col p-2 gap-2">
                  <div className="flex items-center gap-2">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-10 h-10" />
                    )}
                    <div className="flex flex-col">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={signOut}
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeSelector />
            <Button
              onClick={() => setIsCustomThemeModalOpen(true)}
              variant="outline"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Custom Theme
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`md:col-span-1 bg-${currentTheme.secondary} bg-opacity-10 rounded-lg p-4`}
          >
            <Button onClick={addNote} className="w-full mb-4">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Note
            </Button>
            <NoteList
              deleteNote={deleteNote}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              notes={notes}
            />
          </div>
          <div className="md:col-span-2">
            <NoteEditor note={selectedNote} updateNote={updateNote} />
          </div>
        </div>
      </div>
      <CustomThemeModal
        isOpen={isCustomThemeModalOpen}
        onClose={() => setIsCustomThemeModalOpen(false)}
      />
    </div>
  );
}
