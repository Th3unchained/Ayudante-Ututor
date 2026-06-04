import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { CourseSelectionPage } from "./pages/CourseSelectionPage";
import { StudentChatPage } from "./pages/StudentChatPage";
import { courseService } from "./services/courseService";

function AppContent() {
  const { user, logout, isCheckingSession } = useAuth();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState("");

  useEffect(() => {
    if (!user) {
      setCourses([]);
      setSelectedCourse(null);
      return;
    }

    const loadCourses = async () => {
      try {
        setIsLoadingCourses(true);
        setCoursesError("");

        const loadedCourses = await courseService.getStudentCourses();

        setCourses(loadedCourses);
      } catch (error) {
        setCoursesError(error.message || "No se pudieron cargar las asignaturas.");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadCourses();
  }, [user]);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleLogout = async () => {
    await logout();
    setSelectedCourse(null);
    setCourses([]);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100">
        <div className="rounded-3xl border border-teal-200 bg-white/80 px-8 py-6 text-center shadow-xl shadow-teal-100">
          <p className="text-sm font-semibold text-teal-800">
            Cargando sesión...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!selectedCourse) {
    return (
      <CourseSelectionPage
        courses={courses}
        isLoadingCourses={isLoadingCourses}
        coursesError={coursesError}
        onSelectCourse={handleSelectCourse}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  return (
    <StudentChatPage
      selectedCourse={selectedCourse}
      onLogout={handleLogout}
      onBackToCourses={handleBackToCourses}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}