import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { ThemeProvider } from "./context/ThemeContext";
import { initDefaults } from "./lib/storage";
import { useEffect, type ReactNode } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import CourseDiscovery from "./pages/CourseDiscovery";
import CourseDetail from "./pages/CourseDetail";
import MyLearning from "./pages/MyLearning";
import Bookmarks from "./pages/Bookmarks";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import CourseManager from "./pages/CourseManager";
import StudentCourseTracker from "./pages/StudentCourseTracker";
import NotFound from "./pages/not-found";

initDefaults();

function ProtectedRoute({ children, role }: { children: ReactNode; role?: 'student' | 'instructor' }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) setLocation('/login');
    if (!isLoading && user && role && user.role !== role) {
      setLocation(user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard');
    }
  }, [user, isLoading, role, setLocation]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
  if (!user) return null;
  if (role && user.role !== role) return null;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation(user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
  if (user) return null;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/">
        <Landing />
      </Route>
      <Route path="/login">
        <PublicRoute><Login /></PublicRoute>
      </Route>
      <Route path="/signup">
        <PublicRoute><Signup /></PublicRoute>
      </Route>
      <Route path="/student/dashboard">
        <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
      </Route>
      <Route path="/instructor/dashboard">
        <ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>
      </Route>
      <Route path="/courses">
        <ProtectedRoute><CourseDiscovery /></ProtectedRoute>
      </Route>
      <Route path="/courses/:id">
        <ProtectedRoute><CourseDetail /></ProtectedRoute>
      </Route>
      <Route path="/my-learning">
        <ProtectedRoute role="student"><MyLearning /></ProtectedRoute>
      </Route>
      <Route path="/bookmarks">
        <ProtectedRoute role="student"><Bookmarks /></ProtectedRoute>
      </Route>
      <Route path="/activity">
        <ProtectedRoute><Activity /></ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute><Settings /></ProtectedRoute>
      </Route>
      <Route path="/manage-courses">
        <ProtectedRoute role="instructor"><CourseManager /></ProtectedRoute>
      </Route>
      <Route path="/my-courses">
        <ProtectedRoute role="student"><StudentCourseTracker /></ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRoutes />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
