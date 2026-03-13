"use client";

import { useEffect, useRef, useState } from "react";

type ThemeMode = "dark" | "light";
type ThemeVariant =
  | "default"
  | "neon"
  | "ember"
  | "void"
  | "cobalt"
  | "matrix"
  | "shadow"
  | "ultraviolet"
  | "storm"
  | "alloy"
  | "inferno"
  | "midnight"
  | "abyss"
  | "royal"
  | "acid"
  | "carbon"
  | "crimson"
  | "arctic"
  | "glacier"
  | "dawn"
  | "solar"
  | "mint"
  | "rose"
  | "pearl"
  | "citrus"
  | "sky"
  | "lavender"
  | "sand"
  | "mono"
  | "coral"
  | "ocean"
  | "orchid"
  | "forest"
  | "cherry"
  | "ivory"
  | "obsidian"
  | "phantom"
  | "aurora"
  | "voltage"
  | "magma"
  | "ion"
  | "onyx"
  | "cyber"
  | "twilight"
  | "synthwave"
  | "deepsea"
  | "toxic"
  | "zenith"
  | "embercore"
  | "nightfall"
  | "quantum"
  | "arcane"
  | "monsoon"
  | "cloud"
  | "frost"
  | "sunset"
  | "meadow"
  | "lagoon"
  | "blush"
  | "linen"
  | "sakura"
  | "candy"
  | "apricot"
  | "teal"
  | "lilac"
  | "slate"
  | "honey"
  | "spruce"
  | "plum"
  | "aqua"
  | "copper";
type ThemePresetMap = {
  dark: ThemeVariant;
  light: ThemeVariant;
};

const STORAGE_MODE_KEY = "shadowlab-theme";
const STORAGE_PRESETS_KEY = "shadowlab-theme-presets";

const DARK_VARIANTS: ThemeVariant[] = [
  "default",
  "neon",
  "ember",
  "void",
  "cobalt",
  "matrix",
  "shadow",
  "ultraviolet",
  "storm",
  "alloy",
  "inferno",
  "midnight",
  "abyss",
  "royal",
  "acid",
  "carbon",
  "crimson",
  "arctic",
  "obsidian",
  "phantom",
  "aurora",
  "voltage",
  "magma",
  "ion",
  "onyx",
  "cyber",
  "twilight",
  "synthwave",
  "deepsea",
  "toxic",
  "zenith",
  "embercore",
  "nightfall",
  "quantum",
  "arcane",
  "monsoon",
];

const LIGHT_VARIANTS: ThemeVariant[] = [
  "default",
  "glacier",
  "dawn",
  "solar",
  "mint",
  "rose",
  "pearl",
  "citrus",
  "sky",
  "lavender",
  "sand",
  "mono",
  "coral",
  "ocean",
  "orchid",
  "forest",
  "cherry",
  "ivory",
  "cloud",
  "frost",
  "sunset",
  "meadow",
  "lagoon",
  "blush",
  "linen",
  "sakura",
  "candy",
  "apricot",
  "teal",
  "lilac",
  "slate",
  "honey",
  "spruce",
  "plum",
  "aqua",
  "copper",
];

const modeVariants: Record<ThemeMode, Array<{ id: ThemeVariant; label: string }>> = {
  dark: [
    { id: "default", label: "Core Dark" },
    { id: "neon", label: "Neon Dark" },
    { id: "ember", label: "Ember Dark" },
    { id: "void", label: "Void Dark" },
    { id: "cobalt", label: "Cobalt Dark" },
    { id: "matrix", label: "Matrix Dark" },
    { id: "shadow", label: "Shadow Dark" },
    { id: "ultraviolet", label: "Ultraviolet Dark" },
    { id: "storm", label: "Storm Dark" },
    { id: "alloy", label: "Alloy Dark" },
    { id: "inferno", label: "Inferno Dark" },
    { id: "midnight", label: "Midnight Dark" },
    { id: "abyss", label: "Abyss Dark" },
    { id: "royal", label: "Royal Dark" },
    { id: "acid", label: "Acid Dark" },
    { id: "carbon", label: "Carbon Dark" },
    { id: "crimson", label: "Crimson Dark" },
    { id: "arctic", label: "Arctic Dark" },
    { id: "obsidian", label: "Obsidian Dark" },
    { id: "phantom", label: "Phantom Dark" },
    { id: "aurora", label: "Aurora Dark" },
    { id: "voltage", label: "Voltage Dark" },
    { id: "magma", label: "Magma Dark" },
    { id: "ion", label: "Ion Dark" },
    { id: "onyx", label: "Onyx Dark" },
    { id: "cyber", label: "Cyber Dark" },
    { id: "twilight", label: "Twilight Dark" },
    { id: "synthwave", label: "Synthwave Dark" },
    { id: "deepsea", label: "Deepsea Dark" },
    { id: "toxic", label: "Toxic Dark" },
    { id: "zenith", label: "Zenith Dark" },
    { id: "embercore", label: "Embercore Dark" },
    { id: "nightfall", label: "Nightfall Dark" },
    { id: "quantum", label: "Quantum Dark" },
    { id: "arcane", label: "Arcane Dark" },
    { id: "monsoon", label: "Monsoon Dark" },
  ],
  light: [
    { id: "default", label: "Core Light" },
    { id: "glacier", label: "Glacier Light" },
    { id: "dawn", label: "Dawn Light" },
    { id: "solar", label: "Solar Light" },
    { id: "mint", label: "Mint Light" },
    { id: "rose", label: "Rose Light" },
    { id: "pearl", label: "Pearl Light" },
    { id: "citrus", label: "Citrus Light" },
    { id: "sky", label: "Sky Light" },
    { id: "lavender", label: "Lavender Light" },
    { id: "sand", label: "Sand Light" },
    { id: "mono", label: "Mono Light" },
    { id: "coral", label: "Coral Light" },
    { id: "ocean", label: "Ocean Light" },
    { id: "orchid", label: "Orchid Light" },
    { id: "forest", label: "Forest Light" },
    { id: "cherry", label: "Cherry Light" },
    { id: "ivory", label: "Ivory Light" },
    { id: "cloud", label: "Cloud Light" },
    { id: "frost", label: "Frost Light" },
    { id: "sunset", label: "Sunset Light" },
    { id: "meadow", label: "Meadow Light" },
    { id: "lagoon", label: "Lagoon Light" },
    { id: "blush", label: "Blush Light" },
    { id: "linen", label: "Linen Light" },
    { id: "sakura", label: "Sakura Light" },
    { id: "candy", label: "Candy Light" },
    { id: "apricot", label: "Apricot Light" },
    { id: "teal", label: "Teal Light" },
    { id: "lilac", label: "Lilac Light" },
    { id: "slate", label: "Slate Light" },
    { id: "honey", label: "Honey Light" },
    { id: "spruce", label: "Spruce Light" },
    { id: "plum", label: "Plum Light" },
    { id: "aqua", label: "Aqua Light" },
    { id: "copper", label: "Copper Light" },
  ],
};

function isDarkVariant(variant: ThemeVariant): boolean {
  return DARK_VARIANTS.includes(variant);
}

function isLightVariant(variant: ThemeVariant): boolean {
  return LIGHT_VARIANTS.includes(variant);
}

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
      dark: isDarkVariant(dark) ? dark : "default",
      light: isLightVariant(light) ? light : "default",
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
