import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, GripVertical } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";

export default function ThemeSelector() {
  const { themes, setCurrentTheme, currentTheme } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dropdown = e.currentTarget as HTMLElement;
    dropdown.style.left = `${e.clientX - position.x}px`;
    dropdown.style.top = `${e.clientY - position.y}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 max-h-[80vh] overflow-y-auto bg-gray-900 shadow-lg border border-gray-800"
        style={{ position: "fixed" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="sticky top-0 bg-gray-900 p-2 border-b border-gray-800 cursor-move flex items-center text-white">
          <GripVertical className="h-4 w-4 mr-2 text-gray-400" />
          <span className="font-medium">Theme Selector</span>
        </div>
        <div className="grid grid-cols-1 gap-1 p-2">
          {themes.map((theme) => (
            <DropdownMenuItem
              key={theme.name}
              onClick={() => setCurrentTheme(theme)}
              className={`flex items-center gap-2 cursor-pointer text-white hover:bg-gray-800 ${
                currentTheme.name === theme.name ? "bg-gray-800" : ""
              }`}
            >
              <div
                style={{
                  backgroundColor: `hsl(${theme.primary})`,
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "0.25rem",
                }}
              />
              {theme.name}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
