import React, { useState } from "react";

export function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    user?.fullName ||
    user?.full_name ||
    user?.name ||
    user?.email ||
    "Estudiante";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-left shadow-sm transition hover:bg-slate-50"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-sm font-black text-white shadow-md shadow-teal-500/20">
          {initials || "E"}
        </span>

        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-[170px] truncate text-sm font-black text-slate-800">
            {displayName}
          </span>
          <span className="block text-xs font-bold text-teal-600">
            Estudiante
          </span>
        </span>

        <span className="text-xs font-black text-slate-400">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-64 rounded-[24px] border border-slate-100 bg-white p-3 shadow-2xl shadow-slate-200">
          <div className="rounded-2xl bg-gradient-to-r from-cyan-50 to-emerald-50 px-4 py-3">
            <p className="truncate text-sm font-black text-slate-900">
              {displayName}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
              Estudiante
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout?.();
            }}
            className="mt-3 w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-black text-red-600 transition hover:bg-red-100"
          >
            Cerrar sesión por completo
          </button>
        </div>
      )}
    </div>
  );
}