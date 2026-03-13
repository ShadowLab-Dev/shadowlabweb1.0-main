"use client";

import { useEffect, useRef, useState } from "react";

type ThemeMode = "dark" | "light";
type ThemeVariant = "default" | "neon" | "ember" | "glacier" | "dawn";
type ThemePresetMap = {
  dark: ThemeVariant;
  light: ThemeVariant;
};

const STORAGE_MODE_KEY = "shadowlab-theme";
const STORAGE_PRESETS_KEY = "shadowlab-theme-presets";

const modeVariants: Record<ThemeMode, Array<{ id: ThemeVariant; label: string }>> = {
  dark: [
    { id: "default", label: "Core Dark" },
    { id: "neon", label: "Neon Dark" },
    { id: "ember", label: "Ember Dark" },
  ],
  light: [
    { id: "default", label: "Core Light" },
    { id: "glacier", label: "Glacier Light" },
    { id: "dawn", label: "Dawn Light" },
  ],
};

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(mode: ThemeMode, variant: ThemeVariant) {
  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.setAttribute("data-theme-variant", variant);
}

function parsePresetMap(raw: string | null): ThemePresetMap | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ThemePresetMap>;
    const dark = parsed.dark ?? "default";
    const light = parsed.light ?? "default";
    return {
      dark: dark === "default" || dark === "neon" || dark === "ember" ? dark : "default",
      light: light === "default" || light === "glacier" || light === "dawn" ? light : "default",
    };
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [presetMap, setPresetMap] = useState<ThemePresetMap>({
    dark: "default",
    light: "default",
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_MODE_KEY);
    const initialMode =
      storedMode === "dark" || storedMode === "light" ? storedMode : getSystemTheme();

    const presets =
      parsePresetMap(window.localStorage.getItem(STORAGE_PRESETS_KEY)) ?? {
        dark: "default",
        light: "default",
      };

    setThemeMode(initialMode);
    setPresetMap(presets);
    applyTheme(initialMode, presets[initialMode]);
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      const savedMode = window.localStorage.getItem(STORAGE_MODE_KEY);
      if (savedMode === "dark" || savedMode === "light") {
        return;
      }

      const mode: ThemeMode = event.matches ? "dark" : "light";
      setThemeMode(mode);
      applyTheme(mode, presets[mode]);
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }
      if (!containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleThemeMode = () => {
    const nextMode: ThemeMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextMode);
    applyTheme(nextMode, presetMap[nextMode]);
    window.localStorage.setItem(STORAGE_MODE_KEY, nextMode);
  };

  const setModePreset = (variant: ThemeVariant) => {
    const nextMap: ThemePresetMap = {
      ...presetMap,
      [themeMode]: variant,
    };

    setPresetMap(nextMap);
    applyTheme(themeMode, variant);
    window.localStorage.setItem(STORAGE_PRESETS_KEY, JSON.stringify(nextMap));
  };

  const label = mounted
    ? themeMode === "dark"
      ? "Dark"
      : "Light"
    : "Theme";

  const activeVariant = presetMap[themeMode];

  return (
    <div className="theme-toggle-wrap" ref={containerRef}>
      <div className="theme-toggle-combo">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleThemeMode}
          aria-label="Toggle dark and light mode"
          title="Toggle dark and light mode"
        >
          <span className={`theme-dot ${themeMode === "dark" ? "is-dark" : "is-light"}`} />
          <span>{label}</span>
        </button>

        <button
          type="button"
          className={`theme-expand ${isExpanded ? "is-open" : ""}`}
          onClick={() => setIsExpanded((current) => !current)}
          aria-label="Expand theme presets"
          aria-expanded={isExpanded}
        >
          &gt;
        </button>
      </div>

      {isExpanded ? (
        <div className="theme-presets" role="menu" aria-label={`${themeMode} mode presets`}>
          {modeVariants[themeMode].map((variant) => (
            <button
              key={`${themeMode}-${variant.id}`}
              type="button"
              className={`theme-preset ${activeVariant === variant.id ? "is-active" : ""}`}
              onClick={() => setModePreset(variant.id)}
              role="menuitem"
            >
              {variant.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
