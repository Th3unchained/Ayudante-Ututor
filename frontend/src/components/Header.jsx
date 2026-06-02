import React, { useState } from "react";

export function Header({ courseName, onLogout, onBackToCourses }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="relative z-50 h-20 shrink-0 overflow-visible border-b border-teal-200 bg-white/75 backdrop-blur">
      <div className="grid h-full grid-cols-[288px_1fr_210px] items-stretch overflow-visible">
        <button
          type="button"
          onClick={onBackToCourses}
          disabled={!onBackToCourses}
          title={onBackToCourses ? "Volver a selección de asignatura" : "UTutor"}
          className="flex h-full items-center gap-4 border-r border-teal-200 bg-gradient-to-r from-cyan-100 to-teal-100 px-6 text-left transition hover:from-cyan-200 hover:to-teal-200 disabled:cursor-default disabled:hover:from-cyan-100 disabled:hover:to-teal-100"
        >
          {onBackToCourses && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-xl font-semibold text-teal-700 shadow-md shadow-teal-100">
              ←
            </span>
          )}

          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-2xl font-bold italic leading-none tracking-wide text-teal-950">
              UTutor
            </p>

            {onBackToCourses && (
              <p className="mt-2 text-sm font-medium leading-none text-teal-700">
                Cambiar asignatura
              </p>
            )}
          </div>
        </button>

        <div className="flex h-full min-w-0 items-center px-8">
          <p className="truncate text-lg font-medium text-slate-700">
            {courseName ? `Tutor IA · ${courseName}` : "Panel estudiante"}
          </p>
        </div>

        <div className="relative z-[60] flex h-full items-center justify-center overflow-visible px-4">
          <button
            type="button"
            onClick={() => setOpenMenu((current) => !current)}
            className="h-11 w-full rounded-xl border border-teal-300 bg-white/95 px-5 text-sm font-semibold text-teal-800 shadow-sm hover:bg-teal-50"
          >
            Estudiante ▾
          </button>

          {openMenu && (
            <div className="absolute right-4 top-[62px] z-[999] w-56 overflow-hidden rounded-xl border border-teal-200 bg-white shadow-2xl shadow-teal-200/70">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  Perfil estudiante
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Sesión activa en UTutor
                </p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}