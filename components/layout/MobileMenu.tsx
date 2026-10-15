"use client";

import Link from "next/link";
import { container } from "@/lib/ui";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

type MobileMenuProps = {
  items: { href: string; label: string }[];
  navLabel: string;
  openLabel: string;
  closeLabel: string;
};

/**
 * Disclosure menu for small screens. While open, Tab cycles between the toggle
 * button and the links, and Escape closes the menu and returns focus to the button.
 */
export function MobileMenu({
  items,
  navLabel,
  openLabel,
  closeLabel,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const button = buttonRef.current;
    const panel = panelRef.current;
    if (!open || !button || !panel) return;

    const links = () =>
      Array.from(panel.querySelectorAll<HTMLElement>("a[href]"));
    links()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button?.focus();
        return;
      }
      if (event.key !== "Tab" || !button) return;

      const focusables = [button, ...links()];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active !== null && focusables.includes(active);

      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const label = open ? closeLabel : openLabel;

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        title={label}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center hover:bg-muted"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-foreground bg-background"
      >
        <nav aria-label={navLabel}>
          <ul className={`${container} flex flex-col py-4`}>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 type-display text-4xl hover:underline hover:decoration-2 hover:underline-offset-4"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
