import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Sparkles,
  Edit3,
  MessageSquarePlus,
  ListChecks,
  Wand2,
  BrainCircuit,
  Eraser,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";
import { useTheme } from "@/contexts/ThemeContext";

interface AIAssistantProps {
  editor: Editor;
}

type AIAction = {
  label: string;
  icon: React.ReactNode;
  prompt: string;
  placeholder: string;
};

const AI_ACTIONS: AIAction[] = [
  {
    label: "Improve Writing",
    icon: <Edit3 className="h-4 w-4" />,
    prompt: "Improve this text while maintaining its meaning and tone: ",
    placeholder: "Enter text to improve...",
  },
  {
    label: "Continue Writing",
    icon: <MessageSquarePlus className="h-4 w-4" />,
    prompt:
      "Continue this text naturally, maintaining the same style and tone: ",
    placeholder: "Enter text to continue from...",
  },
  {
    label: "Generate Outline",
    icon: <ListChecks className="h-4 w-4" />,
    prompt: "Create a detailed outline for this topic: ",
    placeholder: "Enter topic or paste existing text...",
  },
  {
    label: "Fix Grammar",
    icon: <Wand2 className="h-4 w-4" />,
    prompt: "Fix any grammar, spelling, or punctuation issues in this text: ",
    placeholder: "Enter text to check...",
  },
  {
    label: "Summarize",
    icon: <BrainCircuit className="h-4 w-4" />,
    prompt: "Provide a concise summary of this text: ",
    placeholder: "Enter text to summarize...",
  },
  {
    label: "Simplify",
    icon: <Eraser className="h-4 w-4" />,
    prompt: "Simplify this text to make it clearer and more accessible: ",
    placeholder: "Enter text to simplify...",
  },
];

export const AIAssistant: React.FC<AIAssistantProps> = ({ editor }) => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleActionSelect = (action: AIAction) => {
    setSelectedAction(action);
    setIsOpen(true);

    // If text is selected, use it as initial prompt
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );
    if (selectedText) {
      setPrompt(selectedText);
    }
  };

  const typeContentIntoEditor = async (content: string) => {
    const chars = content.split("");
    for (let i = 0; i < chars.length; i++) {
      editor.chain().insertContent(chars[i]).run();
      // Random delay between 20-50ms for more natural typing
      const delay = Math.random() * 30 + 20;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    // Add a small pause after each sentence
    if ([".", "!", "?"].includes(chars[chars.length - 1])) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const handleAIAssist = async () => {
    if (!prompt.trim() || !selectedAction) {
      toast.error("Please enter some text");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: selectedAction.prompt + prompt,
          context: editor.getText(),
        }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      if (!data.text) {
        throw new Error("No response received from AI");
      }

      // Replace the direct insertion with animated typing
      if (editor.state.selection.empty) {
        await typeContentIntoEditor(data.text);
      } else {
        editor.chain().focus().deleteSelection().run();
        await typeContentIntoEditor(data.text);
      }

      setPrompt("");
      setIsOpen(false);
      toast.success("AI content added successfully");
    } catch (error) {
      console.error("AI Assistant error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to get AI response"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all"
            style={{
              backgroundColor: `hsl(${currentTheme.background})`,
              borderColor: `hsl(${currentTheme.accent})`,
            }}
            title="AI Assistant"
          >
            <Sparkles
              className="h-5 w-5"
              style={{ color: `hsl(${currentTheme.accent})` }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56"
          style={{
            backgroundColor: `hsl(${currentTheme.background})`,
            borderColor: `hsl(${currentTheme.accent})`,
          }}
        >
          {AI_ACTIONS.map((action) => (
            <DropdownMenuItem
              key={action.label}
              onClick={() => handleActionSelect(action)}
              className="gap-2"
              style={{
                color: `hsl(${currentTheme.text})`,
              }}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isOpen && selectedAction && (
        <div
          className="absolute bottom-16 right-0 w-96 rounded-lg shadow-xl border overflow-hidden"
          style={{
            backgroundColor: `hsl(${currentTheme.background})`,
            borderColor: `hsl(${currentTheme.accent})`,
          }}
        >
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: `hsl(${currentTheme.accent})` }}
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              {selectedAction.icon}
              {selectedAction.label}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setPrompt("");
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 space-y-4">
            <Textarea
              placeholder={selectedAction.placeholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
              style={{
                backgroundColor: `hsl(${currentTheme.secondary})`,
                color: `hsl(${currentTheme.text})`,
              }}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAIAssist}
                disabled={isLoading}
                className="w-24"
                style={{
                  backgroundColor: `hsl(${currentTheme.accent})`,
                  color: `hsl(${currentTheme.background})`,
                }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
