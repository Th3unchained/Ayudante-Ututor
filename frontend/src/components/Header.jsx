import React from "react";
import { UserMenu } from "./UserMenu";

export function Header({
  course,
  user,
  onBackToCourses,
  onOpenSaveModal,
  onLogout,
}) {
  return (
    <header className="flex h-20 shrink-0 items-center border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-full w-[320px] shrink-0 items-center gap-4 border-r border-slate-200 bg-gradient-to-r from-teal-100 to-cyan-50 px-6">
        {onBackToCourses && (
          <button
            type="button"
            onClick={onBackToCourses}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl font-bold text-teal-700 shadow-sm transition hover:bg-teal-50"
            title="Volver a asignaturas"
          >
            ←
          </button>
        )}

        <div className="flex min-w-0 flex-col justify-center">
          <h1 className="text-2xl font-black italic leading-none text-slate-900">
            UTutor
          </h1>

          {onBackToCourses && (
            <button
              type="button"
              onClick={onBackToCourses}
              className="mt-1 text-left text-sm font-semibold text-teal-700 transition hover:text-teal-900"
            >
              Cambiar asignatura
            </button>
          )}
        </div>
      </div>

      <div className="flex h-full min-w-0 flex-1 items-center justify-between px-8">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            Tutor académico
          </p>

          <h2 className="mt-1 truncate text-lg font-black text-slate-900">
            {course?.name ?? "Asignatura"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {onOpenSaveModal && (
            <button
              type="button"
              onClick={onOpenSaveModal}
              className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
            >
              Guardar consulta
            </button>
          )}

          <UserMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}