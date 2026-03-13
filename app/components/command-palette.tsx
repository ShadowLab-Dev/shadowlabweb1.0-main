"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SectorEntry = {
  label: string;
  path: string;
  description: string;
};

const sectorEntries: SectorEntry[] = [
  {
    label: "Gateway",
    path: "/",
    description: "Primary landing and live arcade systems.",
  },
  {
    label: "Experiments",
    path: "/lab",
    description: "Interactive visual systems and motion tests.",
  },
  {
    label: "Archive",
    path: "/about",
    description: "Curated references and standout web experiences.",
  },
  {
    label: "Reactor",
    path: "/studio",
    description: "Live interface tuning and visual parameter control.",
  },
  {
    label: "Vault",
    path: "/work",
    description: "Prototype worlds and concept interface collections.",
  },
  {
    label: "Signal",
    path: "/contact",
    description: "Outbound resources, links, and system relay.",
  },
  {
    label: "Logs",
    path: "/updates",
    description: "Transmission feed for updates and discoveries.",
  },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        setIsOpen((current) => !current);
        return;
      }

      if (key === "escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredEntries = normalizedQuery
    ? sectorEntries.filter((entry) =>
        `${entry.label} ${entry.path} ${entry.description}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : sectorEntries;

  return (
    <>
      <button
        type="button"
        className="command-launcher"
        onClick={() => setIsOpen(true)}
        aria-label="Open command palette"
      >
        <span>Command Layer</span>
        <kbd>Ctrl / Cmd + K</kbd>
      </button>

      {isOpen ? (
        <div className="command-overlay" role="dialog" aria-modal="true" onClick={() => setIsOpen(false)}>
          <div className="command-panel" onClick={(event) => event.stopPropagation()}>
            <div className="command-head">
              <p className="micro-label">Sector Nav</p>
              <button
                type="button"
                className="command-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close command palette"
              >
                Esc
              </button>
            </div>

            <input
              autoFocus
              type="text"
              className="command-input"
              placeholder="Search sector, route, or function..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search sectors"
            />

            <div className="command-list" role="list">
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <Link
                    key={entry.path}
                    href={entry.path}
                    className="command-item"
                    onClick={() => setIsOpen(false)}
                    role="listitem"
                  >
                    <span>{entry.label}</span>
                    <small>{entry.description}</small>
                    <code>{entry.path}</code>
                  </Link>
                ))
              ) : (
                <p className="command-empty">No sectors matched that signal.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
