import type React from "react"
import { useState } from "react"
import { useTheme, type Theme } from "../../contexts/ThemeContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CustomThemeModalProps = {
  isOpen: boolean
  onClose: () => void
}

const CustomThemeModal: React.FC<CustomThemeModalProps> = ({ isOpen, onClose }) => {
  const { addTheme } = useTheme()
  const [newTheme, setNewTheme] = useState<Theme>({
    name: "",
    primary: "",
    secondary: "",
    background: "",
    text: "",
    accent: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(newTheme).every((value) => value)) {
      addTheme(newTheme)
      setNewTheme({ name: "", primary: "", secondary: "", background: "", text: "", accent: "" })
      onClose()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTheme({ ...newTheme, [e.target.name]: e.target.value })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Custom Theme</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Theme Name</Label>
            <Input id="name" name="name" value={newTheme.name} onChange={handleChange} placeholder="My Custom Theme" />
          </div>
          <div>
            <Label htmlFor="primary">Primary Color</Label>
            <Input
              id="primary"
              name="primary"
              value={newTheme.primary}
              onChange={handleChange}
              placeholder="blue-600"
            />
          </div>
          <div>
            <Label htmlFor="secondary">Secondary Color</Label>
            <Input
              id="secondary"
              name="secondary"
              value={newTheme.secondary}
              onChange={handleChange}
              placeholder="purple-600"
            />
          </div>
          <div>
            <Label htmlFor="background">Background Color</Label>
            <Input
              id="background"
              name="background"
              value={newTheme.background}
              onChange={handleChange}
              placeholder="gray-100"
            />
          </div>
          <div>
            <Label htmlFor="text">Text Color</Label>
            <Input id="text" name="text" value={newTheme.text} onChange={handleChange} placeholder="gray-900" />
          </div>
          <div>
            <Label htmlFor="accent">Accent Color</Label>
            <Input id="accent" name="accent" value={newTheme.accent} onChange={handleChange} placeholder="green-500" />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Custom Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CustomThemeModal

