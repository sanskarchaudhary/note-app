"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export type Theme = {
  id?: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
};

const defaultThemes: Theme[] = [
  {
    name: "Modern Light",
    primary: "215 70% 40%",
    secondary: "220 20% 85%",
    background: "0 0% 100%",
    text: "215 50% 23%",
    accent: "215 70% 40%",
  },
  {
    name: "Dark Mode",
    primary: "230 60% 60%",
    secondary: "230 15% 25%",
    background: "230 25% 10%",
    text: "230 15% 95%",
    accent: "230 60% 60%",
  },
  {
    name: "Sepia",
    primary: "35 40% 40%",
    secondary: "35 20% 80%",
    background: "35 30% 95%",
    text: "35 40% 20%",
    accent: "35 40% 40%",
  },
  {
    name: "Ocean Blue",
    primary: "195 60% 50%",
    secondary: "195 30% 85%",
    background: "195 30% 97%",
    text: "195 60% 25%",
    accent: "195 60% 50%",
  },
  {
    name: "Forest Green",
    primary: "150 40% 40%",
    secondary: "150 30% 85%",
    background: "150 30% 97%",
    text: "150 40% 20%",
    accent: "150 40% 40%",
  },
  {
    name: "Royal Purple",
    primary: "270 50% 60%",
    secondary: "270 30% 85%",
    background: "270 30% 97%",
    text: "270 40% 25%",
    accent: "270 50% 60%",
  },
  {
    name: "Mint",
    primary: "160 50% 45%",
    secondary: "160 30% 85%",
    background: "160 30% 97%",
    text: "160 50% 25%",
    accent: "160 50% 45%",
  },
  {
    name: "Cherry Blossom",
    primary: "350 60% 65%",
    secondary: "350 30% 85%",
    background: "350 30% 97%",
    text: "350 50% 25%",
    accent: "350 60% 65%",
  },
  {
    name: "Mocha",
    primary: "30 40% 35%",
    secondary: "30 30% 75%",
    background: "30 20% 97%",
    text: "30 40% 20%",
    accent: "30 40% 35%",
  },
  {
    name: "Arctic",
    primary: "200 50% 60%",
    secondary: "200 30% 85%",
    background: "200 30% 97%",
    text: "200 50% 30%",
    accent: "200 50% 60%",
  },
  {
    name: "Sunset",
    primary: "25 80% 50%",
    secondary: "25 30% 85%",
    background: "35 100% 97%",
    text: "25 80% 25%",
    accent: "15 80% 50%",
  },
  {
    name: "Cyber",
    primary: "285 80% 60%",
    secondary: "285 30% 25%",
    background: "285 20% 10%",
    text: "285 15% 95%",
    accent: "315 80% 60%",
  },
  {
    name: "Desert",
    primary: "35 60% 45%",
    secondary: "35 30% 75%",
    background: "35 30% 95%",
    text: "35 60% 25%",
    accent: "15 60% 45%",
  },
  {
    name: "Glacier",
    primary: "180 60% 50%",
    secondary: "180 30% 85%",
    background: "180 30% 97%",
    text: "180 60% 25%",
    accent: "200 60% 50%",
  },
  {
    name: "Autumn",
    primary: "25 70% 45%",
    secondary: "25 30% 75%",
    background: "25 30% 95%",
    text: "25 70% 25%",
    accent: "15 70% 45%",
  },
  {
    name: "Neon Night",
    primary: "320 80% 60%",
    secondary: "320 30% 25%",
    background: "320 20% 10%",
    text: "320 15% 95%",
    accent: "280 80% 60%",
  },
  {
    name: "Olive Garden",
    primary: "110 40% 45%",
    secondary: "110 30% 75%",
    background: "110 30% 95%",
    text: "110 40% 25%",
    accent: "90 40% 45%",
  },
  {
    name: "Berry",
    primary: "330 70% 50%",
    secondary: "330 30% 85%",
    background: "330 30% 97%",
    text: "330 70% 25%",
    accent: "350 70% 50%",
  },
  {
    name: "Deep Ocean",
    primary: "210 70% 50%",
    secondary: "210 30% 25%",
    background: "210 20% 10%",
    text: "210 15% 95%",
    accent: "190 70% 50%",
  },
  {
    name: "Spring",
    primary: "140 60% 45%",
    secondary: "140 30% 85%",
    background: "140 30% 97%",
    text: "140 60% 25%",
    accent: "120 60% 45%",
  },
];

type ThemeContextType = {
  currentTheme: Theme;
  themes: Theme[];
  setCurrentTheme: (theme: Theme) => void;
  addTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0]);
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);

  useEffect(() => {
    const fetchThemes = async () => {
      const themesCollection = collection(db, "themes");
      const themesSnapshot = await getDocs(themesCollection);
      const customThemes = themesSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Theme)
      );
      setThemes([...defaultThemes, ...customThemes]);
    };

    const storedTheme = localStorage.getItem("currentTheme");
    if (storedTheme) {
      setCurrentTheme(JSON.parse(storedTheme));
    }

    fetchThemes();
  }, []);

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", `hsl(${currentTheme.primary})`);
    root.style.setProperty(
      "--theme-secondary",
      `hsl(${currentTheme.secondary})`
    );
    root.style.setProperty(
      "--theme-background",
      `hsl(${currentTheme.background})`
    );
    root.style.setProperty("--theme-text", `hsl(${currentTheme.text})`);
    root.style.setProperty("--theme-accent", `hsl(${currentTheme.accent})`);

    // Save theme preference
    localStorage.setItem("currentTheme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const addTheme = async (newTheme: Theme) => {
    const themesCollection = collection(db, "themes");
    const docRef = await addDoc(themesCollection, newTheme);
    const themeWithId = { ...newTheme, id: docRef.id };
    setThemes([...themes, themeWithId]);
  };

  return (
    <ThemeContext.Provider
      value={{ currentTheme, themes, setCurrentTheme, addTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
