import React from "react";
import { UserMenu } from "../components/UserMenu";
import { useAuth } from "../context/AuthContext";

export function CourseSelectionPage({
  courses = [],
  isLoadingCourses = false,
  coursesError = "",
  onSelectCourse,
  onLogout,
  user,
}) {
  const courseList = Array.isArray(courses) ? courses : [];
  const { user } = useAuth();

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 p-3">
      <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-teal-300 bg-white/75 shadow-2xl shadow-teal-200/60 backdrop-blur-md">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute right-[-90px] top-20 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <header className="flex h-20 shrink-0 items-center border-b border-slate-200 bg-white shadow-sm">
            <div className="flex h-full w-[320px] shrink-0 items-center border-r border-slate-200 bg-gradient-to-r from-teal-100 to-cyan-50 px-8">
              <h1 className="text-2xl font-black italic leading-none text-slate-900">
                UTutor
              </h1>
            </div>

            <div className="flex h-full min-w-0 flex-1 items-center justify-between px-8">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                  Tutor académico
                </p>

                <h2 className="mt-1 truncate text-lg font-black text-slate-900">
                  Asignaturas
                </h2>
              </div>

              <UserMenu user={user} onLogout={onLogout} />
            </div>
          </header>

          <div className="flex min-h-0 flex-1">
            <aside className="flex h-full w-[320px] shrink-0 flex-col border-r border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">
              <div className="border-b border-slate-100 bg-gradient-to-br from-teal-100 to-cyan-50 px-8 py-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
                  Panel estudiante
                </p>

                <h2 className="mt-3 text-2xl font-black text-slate-900">
                  Mis asignaturas
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Selecciona un curso para iniciar el acompañamiento con UTutor.
                </p>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-4 p-5">
                <div className="rounded-[28px] border border-teal-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-black text-teal-800">
                    Tutor disponible
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    Las respuestas se generarán usando el material oficial
                    definido para cada asignatura.
                  </p>
                </div>

                <div className="rounded-[28px] border border-cyan-100 bg-gradient-to-br from-white to-cyan-50/70 p-5 shadow-sm">
                  <p className="text-sm font-black text-cyan-800">
                    Modo estudiante
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    Podrás realizar consultas, guardar conversaciones y revisar
                    fuentes utilizadas por el tutor.
                  </p>
                </div>
              </div>
            </aside>

            <section className="flex min-w-0 flex-1 flex-col">
              <div className="shrink-0 border-b border-teal-200 bg-white/70 px-8 py-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Selección de asignatura
                </p>

                <h1 className="mt-1 text-2xl font-bold text-teal-950">
                  Elige una asignatura
                </h1>

                <p className="mt-1 text-sm text-slate-600">
                  Al seleccionar una asignatura accederás al chat académico
                  asociado a sus documentos y contenidos.
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-5xl">
                  {coursesError && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
                      {coursesError}
                    </div>
                  )}

                  {isLoadingCourses ? (
                    <div className="rounded-[30px] border border-teal-100 bg-white/90 px-8 py-12 text-center shadow-sm">
                      <p className="text-lg font-black text-teal-700">
                        Cargando asignaturas...
                      </p>
                    </div>
                  ) : courseList.length === 0 ? (
                    <div className="rounded-[30px] border border-dashed border-slate-200 bg-white/90 px-8 py-12 text-center shadow-sm">
                      <p className="text-lg font-black text-slate-700">
                        No hay asignaturas disponibles.
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Revisa que el estudiante esté inscrito en una asignatura.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {courseList.map((course) => (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => onSelectCourse?.(course)}
                          className="group rounded-[30px] border border-teal-100 bg-white/95 p-6 text-left shadow-lg shadow-teal-100/50 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-200/60"
                        >
                          <div className="mb-5 inline-flex rounded-full bg-teal-100 px-3 py-1.5">
                            <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                              Asignatura
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-slate-900">
                            {course.name}
                          </h3>

                          {course.code && (
                            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                              {course.code}
                            </p>
                          )}

                          {course.description && (
                            <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-500">
                              {course.description}
                            </p>
                          )}

                          <div className="mt-6 flex items-center justify-between">
                            <span className="text-sm font-bold text-teal-700">
                              Entrar al tutor
                            </span>

                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-lg font-black text-white shadow-lg shadow-teal-500/20 transition group-hover:scale-105">
                              →
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}