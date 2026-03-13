"use client";

import { useEffect, useRef, useState } from "react";

const DARK_VARIANTS = [
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
] as const;

const LIGHT_VARIANTS = [
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
] as const;

const FLUX_VARIANTS = [
  "default",
  "prism",
  "nova",
  "mercury",
  "auric",
  "opal",
  "plasma",
  "hologram",
  "dusk",
  "emberglass",
  "icefire",
  "ultra",
  "vector",
  "zen",
  "byte",
  "rift",
  "vapor",
  "arc",
  "spectral",
  "pulse",
  "lumen",
  "echo",
  "afterglow",
  "quartz",
  "oxide",
  "iridescent",
  "cosmic",
  "static",
  "mirage",
  "rune",
  "circuit",
  "dream",
  "aether",
  "zenithal",
  "helix",
  "wavelength",
] as const;

type ThemeMode = "dark" | "light" | "flux";
type DarkVariant = (typeof DARK_VARIANTS)[number];
type LightVariant = (typeof LIGHT_VARIANTS)[number];
type FluxVariant = (typeof FLUX_VARIANTS)[number];
type ThemeVariant = DarkVariant | LightVariant | FluxVariant;
type ThemePresetMap = {
  dark: DarkVariant;
  light: LightVariant;
  flux: FluxVariant;
};

const STORAGE_MODE_KEY = "shadowlab-theme";
const STORAGE_PRESETS_KEY = "shadowlab-theme-presets";
const FLUX_HOLD_MS = 3000;

function isThemeMode(value: string): value is ThemeMode {
  return value === "dark" || value === "light" || value === "flux";
}

function isDarkVariant(value: string): value is DarkVariant {
  return (DARK_VARIANTS as readonly string[]).includes(value);
}

function isLightVariant(value: string): value is LightVariant {
  return (LIGHT_VARIANTS as readonly string[]).includes(value);
}

function isFluxVariant(value: string): value is FluxVariant {
  return (FLUX_VARIANTS as readonly string[]).includes(value);
}

function getSystemTheme(): "dark" | "light" {
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
    const parsed = JSON.parse(raw) as Partial<Record<ThemeMode, string>>;
    const darkCandidate = parsed.dark ?? "";
    const lightCandidate = parsed.light ?? "";
    const fluxCandidate = parsed.flux ?? "";

    return {
      dark: isDarkVariant(darkCandidate) ? darkCandidate : "default",
      light: isLightVariant(lightCandidate) ? lightCandidate : "default",
      flux: isFluxVariant(fluxCandidate) ? fluxCandidate : "default",
    };
  } catch {
    return null;
  }
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const modeVariants: Record<ThemeMode, Array<{ id: ThemeVariant; label: string }>> = {
  dark: DARK_VARIANTS.map((id) => ({
    id,
    label: id === "default" ? "Core Dark" : `${titleCase(id)} Dark`,
  })),
  light: LIGHT_VARIANTS.map((id) => ({
    id,
    label: id === "default" ? "Core Light" : `${titleCase(id)} Light`,
  })),
  flux: FLUX_VARIANTS.map((id) => ({
    id,
    label: id === "default" ? "Core Flux" : `${titleCase(id)} Flux`,
  })),
};

export default function ThemeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [presetMap, setPresetMap] = useState<ThemePresetMap>({
    dark: "default",
    light: "default",
    flux: "default",
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHoldingFlux, setIsHoldingFlux] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fluxHoldTimeoutRef = useRef<number | null>(null);
  const didTriggerFluxHoldRef = useRef(false);

  const clearFluxHoldTimeout = () => {
    if (fluxHoldTimeoutRef.current) {
      window.clearTimeout(fluxHoldTimeoutRef.current);
      fluxHoldTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const storedMode = window.localStorage.getItem(STORAGE_MODE_KEY);
    const storedModeCandidate = storedMode ?? "";
    const initialMode: ThemeMode = isThemeMode(storedModeCandidate)
      ? storedModeCandidate
      : getSystemTheme();

    const presets =
      parsePresetMap(window.localStorage.getItem(STORAGE_PRESETS_KEY)) ?? {
        dark: "default",
        light: "default",
        flux: "default",
      };

    setThemeMode(initialMode);
    setPresetMap(presets);
    applyTheme(initialMode, presets[initialMode]);
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      const savedMode = window.localStorage.getItem(STORAGE_MODE_KEY);
      const savedModeCandidate = savedMode ?? "";
      if (isThemeMode(savedModeCandidate)) {
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
      clearFluxHoldTimeout();
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const setModeAndPersist = (mode: ThemeMode, variant: ThemeVariant) => {
    setThemeMode(mode);
    applyTheme(mode, variant);
    window.localStorage.setItem(STORAGE_MODE_KEY, mode);
  };

  const toggleThemeMode = () => {
    if (didTriggerFluxHoldRef.current) {
      didTriggerFluxHoldRef.current = false;
      return;
    }

    const nextMode: ThemeMode =
      themeMode === "dark" ? "light" : themeMode === "light" ? "dark" : "dark";
    setModeAndPersist(nextMode, presetMap[nextMode]);
  };

  const setModePreset = (variant: ThemeVariant) => {
    if (
      (themeMode === "dark" && !isDarkVariant(variant)) ||
      (themeMode === "light" && !isLightVariant(variant)) ||
      (themeMode === "flux" && !isFluxVariant(variant))
    ) {
      return;
    }

    const nextMap: ThemePresetMap = {
      ...presetMap,
      [themeMode]: variant,
    };

    setPresetMap(nextMap);
    applyTheme(themeMode, variant);
    window.localStorage.setItem(STORAGE_PRESETS_KEY, JSON.stringify(nextMap));
  };

  const startFluxHold = () => {
    clearFluxHoldTimeout();
    didTriggerFluxHoldRef.current = false;
    setIsHoldingFlux(true);

    fluxHoldTimeoutRef.current = window.setTimeout(() => {
      didTriggerFluxHoldRef.current = true;
      setIsHoldingFlux(false);
      setIsExpanded(false);
      setModeAndPersist("flux", presetMap.flux);
    }, FLUX_HOLD_MS);
  };

  const stopFluxHold = () => {
    clearFluxHoldTimeout();
    setIsHoldingFlux(false);
  };

  const label = mounted
    ? themeMode === "dark"
      ? "Dark"
      : themeMode === "light"
        ? "Light"
        : "Flux"
    : "Theme";

  const activeVariant = presetMap[themeMode];
  const dotClass =
    themeMode === "dark"
      ? "is-dark"
      : themeMode === "light"
        ? "is-light"
        : "is-flux";

  return (
    <div className="theme-toggle-wrap" ref={containerRef}>
      <div className="theme-toggle-combo">
        <button
          type="button"
          className={`theme-toggle ${isHoldingFlux ? "is-holding" : ""}`}
          onClick={toggleThemeMode}
          onPointerDown={startFluxHold}
          onPointerUp={stopFluxHold}
          onPointerLeave={stopFluxHold}
          onPointerCancel={stopFluxHold}
          aria-label="Toggle dark and light mode. Hold for 3 seconds to enter flux mode."
          title="Click: Dark/Light. Hold 3s: Flux"
        >
          <span className={`theme-dot ${dotClass}`} />
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
