import type React from "react"
import { useState } from "react"
import { useTheme } from "../../contexts/ThemeContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CustomThemeForm: React.FC = () => {
  const { addTheme } = useTheme()
  const [newTheme, setNewTheme] = useState({
    name: "",
    primary: "",
    secondary: "",
    background: "",
    text: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(newTheme).every((value) => value)) {
      const themeWithAccent = { ...newTheme, accent: "default" } // Assuming "default" as a default accent color
      addTheme(themeWithAccent)
      setNewTheme({ name: "", primary: "", secondary: "", background: "", text: "" })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTheme({ ...newTheme, [e.target.name]: e.target.value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Theme</CardTitle>
      </CardHeader>
      <CardContent>
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
          <Button type="submit">Add Custom Theme</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CustomThemeForm

