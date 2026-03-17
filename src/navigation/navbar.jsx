import { useState } from "react";

/* ── Gear icon ── */
const GearIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/* ── NavItem ── */
export function NavItem({ item, state }) {
  const { link, title } = item;

  if (state === "loading") {
    return (
      <div className="h-[42px] rounded-[10px] bg-neutral-800 animate-pulse" />
    );
  }

  return (
    <a
      href={link}
      className="group flex items-center px-3 py-2 rounded-lg
            text-white no-underline cursor-pointer
            transition-all duration-150
            hover:bg-neutral-800
            hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]
            active:bg-neutral-700"
    >
      <span className="truncate text-[13px] text-neutral-300 group-hover:text-white">
        {title}
      </span>
    </a>
  );
}

/* ── Navbar / Sidebar ── */
export default function Navbar({ navItems = [], state = "idle" }) {
  return (
    <aside className="flex flex-col w-[220px] min-w-[220px] h-screen bg-black text-white font-sans text-sm py-5 px-2 box-border">
      {/* Header */}
      <div className="shrink-0 mb-5">
        <span className="text-lg font-semibold italic text-white pl-3">
          App name
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-2.5 pr-0.5 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        {navItems.map((item, index) => (
          <NavItem key={item.id ?? index} item={item} state={state} />
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 mt-4">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border-[1.5px] border-neutral-700">
          <span className="flex-1 text-[15px] italic font-medium text-white">
            abhishek
          </span>
          <button className="inline-flex items-center justify-center w-[30px] h-[30px] border-none rounded-lg bg-transparent text-neutral-400 cursor-pointer transition-colors duration-150 hover:text-white">
            <GearIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}
