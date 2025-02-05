import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Editor } from "@tiptap/react";

interface WPMCounterProps {
  editor: Editor;
  isSaving: boolean;
}

export const WPMCounter: React.FC<WPMCounterProps> = ({ editor, isSaving }) => {
  const { currentTheme } = useTheme();
  const [wpm, setWpm] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const calculateWPM = useCallback(() => {
    if (!startTime || isSaving) return;
    const currentTime = Date.now();
    const minutes = (currentTime - startTime) / 60000; // Convert to minutes
    if (minutes > 0) {
      const currentWPM = Math.round(wordCount / minutes);
      setWpm(currentWPM);
    }
  }, [startTime, wordCount, isSaving]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (!startTime) {
        setStartTime(Date.now());
      }
      const words = editor.getText().trim().split(/\s+/).length;
      setWordCount(words);
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, startTime]);

  useEffect(() => {
    if (isSaving) {
      return;
    }

    const interval = setInterval(calculateWPM, 1000);
    return () => clearInterval(interval);
  }, [calculateWPM, isSaving]);

  if (!startTime || wpm === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border"
        style={{
          backgroundColor: `hsl(${currentTheme.background})`,
          borderColor: `hsl(${currentTheme.accent})`,
          color: `hsl(${currentTheme.text})`,
        }}
      >
        <motion.div
          animate={{ rotate: isSaving ? 360 : 0 }}
          transition={{
            duration: 2,
            repeat: isSaving ? Infinity : 0,
            ease: "linear",
          }}
        >
          <Activity
            className="h-4 w-4"
            style={{ color: `hsl(${currentTheme.accent})` }}
          />
        </motion.div>
        <motion.span
          key={wpm}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {wpm} WPM
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
};
