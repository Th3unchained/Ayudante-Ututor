import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { courseService } from "../services/courseService";

export function CourseSelectionPage({ onSelectCourse, onLogout }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    courseService.getStudentCourses().then(setCourses);
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 p-3">
      <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-teal-300 bg-white/75 shadow-2xl shadow-teal-200/60 backdrop-blur-md">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute right-[-90px] top-20 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col">
          <Header onLogout={onLogout} />

          <section className="flex min-h-0 flex-1">
            <aside className="hidden w-72 shrink-0 border-r border-teal-200 bg-white/60 backdrop-blur md:block">
              <div className="border-b border-teal-200 bg-gradient-to-r from-cyan-100 to-teal-100 px-6 py-6">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Panel estudiante
                </p>
                <h2 className="mt-2 text-xl font-bold text-teal-950">
                  Mis asignaturas
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Selecciona un curso para iniciar el acompañamiento con UTutor.
                </p>
              </div>

              <div className="p-4">
                <div className="rounded-2xl border border-teal-200 bg-white/80 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-teal-900">
                    Tutor disponible
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Las respuestas se generarán usando el material oficial
                    definido para cada asignatura.
                  </p>
                </div>
              </div>
            </aside>

            <div className="min-w-0 flex-1 overflow-y-auto px-6 py-8 lg:px-10">
              <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                  <div className="inline-flex rounded-full border border-teal-300 bg-white/70 px-5 py-2 text-sm font-medium text-teal-700 shadow-sm">
                    Ayudante académico inteligente
                  </div>

                  <h1 className="mt-5 text-4xl font-bold tracking-tight text-teal-950">
                    Selecciona una asignatura
                  </h1>

                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                    El tutor responderá usando documentos oficiales del curso,
                    mantendrá el historial de tus consultas y te apoyará con
                    explicaciones guiadas.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => onSelectCourse(course)}
                      className="group relative overflow-hidden rounded-[30px] border border-teal-200 bg-white/85 p-6 text-left shadow-xl shadow-teal-100/60 transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-2xl hover:shadow-teal-200/70"
                    >
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-300/40 to-emerald-300/40 blur-2xl transition group-hover:scale-125" />

                      <div className="relative z-10">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-2xl font-bold text-white shadow-lg shadow-teal-200">
                            {course.name?.charAt(0) ?? "A"}
                          </div>

                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            {course.status ?? "Disponible"}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-teal-950">
                          {course.name}
                        </h3>

                        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
                          {course.description}
                        </p>

                        <div className="mt-6 border-t border-teal-100 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Docente
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {course.teacher}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-cyan-50 to-emerald-50 px-4 py-3">
                          <span className="text-sm font-semibold text-teal-800">
                            Abrir tutor
                          </span>

                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white transition group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {courses.length === 0 && (
                  <div className="rounded-[30px] border border-teal-200 bg-white/80 p-10 text-center shadow-xl shadow-teal-100/60">
                    <p className="text-lg font-semibold text-teal-950">
                      No hay asignaturas disponibles
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Cuando el backend esté conectado, aquí aparecerán tus
                      cursos asociados.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}