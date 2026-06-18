import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import utemLogo from "../assets/utem-logo.png";

export function LoginPage() {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login({ email, password });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 p-2 sm:p-4">
      <section className="relative min-h-[calc(100vh-16px)] overflow-hidden rounded-2xl border border-teal-300 bg-white/70 shadow-2xl shadow-teal-200/60 backdrop-blur-md sm:min-h-[calc(100vh-32px)] sm:rounded-[28px]">
        <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-2xl border border-teal-200 bg-white/80 px-3 py-2 shadow-lg shadow-teal-100/60 backdrop-blur sm:left-8 sm:top-8 sm:gap-3 sm:px-4 sm:py-3">
          <img
            src={utemLogo}
            alt="Logo UTEM"
            className="h-10 w-auto object-contain sm:h-14"
          />

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-teal-950">UTEM</p>
            <p className="text-xs text-teal-1000">
              Universidad Tecnológica Metropolitana
            </p>
          </div>
        </div>

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute right-[-90px] top-20 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative z-10 grid min-h-[calc(100vh-16px)] grid-cols-1 items-center gap-8 px-4 py-20 sm:min-h-[calc(100vh-32px)] sm:gap-10 sm:px-8 sm:py-24 lg:grid-cols-[1fr_420px] lg:px-24">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6 rounded-full border border-teal-300 bg-white/70 px-5 py-2 text-sm font-medium text-teal-700 shadow-sm">
              Ayudante académico inteligente
            </div>

            <h1 className="font-serif text-[52px] font-bold italic leading-none tracking-tight text-teal-950 drop-shadow-sm sm:text-[76px] md:text-[96px]">
              UTutor
            </h1>

            <div className="mt-3 h-1 w-40 rounded-full bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-400" />

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-700">
              Plataforma de apoyo para estudiantes, orientada a resolver dudas,
              reforzar contenidos y acompañar el aprendizaje en Estructura de
              Datos.
            </p>

            <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-cyan-800">
                  Respuestas
                </p>
                <p className="mt-1 text-xs text-cyan-700">guiadas</p>
              </div>

              <div className="rounded-2xl border border-teal-200 bg-teal-50/80 p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-teal-800">
                  Material
                </p>
                <p className="mt-1 text-xs text-teal-700">del curso</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-center shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">
                  Consultas
                </p>
                <p className="mt-1 text-xs text-emerald-700">guardadas</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-[380px] rounded-[28px] border border-teal-300 bg-white/85 p-6 shadow-2xl shadow-teal-300/30 backdrop-blur sm:rounded-[34px] sm:p-8"
          >
            <div className="mb-7 text-center">
              <h2 className="text-2xl font-bold text-teal-950">
                Iniciar sesión
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Ingresa como estudiante para acceder al tutor.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-teal-900">
                  Correo
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="estudiante@utem.cl"
                  className="h-11 w-full rounded-xl border border-teal-300 bg-teal-50/40 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-teal-900">
                  Contraseña
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="h-11 w-full rounded-xl border border-teal-300 bg-teal-50/40 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
              </label>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-7 h-11 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-sm font-bold text-white shadow-lg shadow-teal-300/40 transition hover:scale-[1.01] hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-600 disabled:opacity-60"
            >
              {isLoading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <p className="mt-5 text-center text-xs text-slate-400">
              Versión prototipo · Login mock
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}