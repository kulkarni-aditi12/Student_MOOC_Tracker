import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Course, Enrollment, Bookmark } from '../types';
import {
  getAllCourses,
  getUserEnrollments,
  getUserBookmarks,
  saveEnrollment,
  toggleBookmark as storageToggleBookmark,
  addActivity,
  generateId,
} from '../lib/storage';
import { useAuth } from './AuthContext';

interface CourseContextType {
  courses: Course[];
  enrollments: Enrollment[];
  bookmarks: Bookmark[];
  enroll: (courseId: string) => void;
  updateProgress: (courseId: string, progress: number, completedModuleId?: string) => void;
  toggleBookmark: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  isBookmarked: (courseId: string) => boolean;
  getEnrollment: (courseId: string) => Enrollment | undefined;
  saveNotes: (courseId: string, notes: string) => void;
  refresh: () => void;
}

const CourseContext = createContext<CourseContextType | null>(null);

export function CourseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(() => getAllCourses());
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() =>
    user ? getUserEnrollments(user.id) : []
  );
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() =>
    user ? getUserBookmarks(user.id) : []
  );

  const refresh = useCallback(() => {
    setCourses(getAllCourses());
    if (user) {
      setEnrollments(getUserEnrollments(user.id));
      setBookmarks(getUserBookmarks(user.id));
    }
  }, [user]);

  const enroll = useCallback((courseId: string) => {
    if (!user) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    const enrollment: Enrollment = {
      userId: user.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: 'not-started',
      lastAccessedAt: new Date().toISOString(),
      notes: '',
      completedModules: [],
    };
    saveEnrollment(enrollment);
    addActivity({
      id: generateId(),
      userId: user.id,
      type: 'enrolled',
      courseId,
      courseTitle: course.title,
      message: `Enrolled in "${course.title}"`,
      timestamp: new Date().toISOString(),
    });
    setEnrollments(getUserEnrollments(user.id));
  }, [user, courses]);

  const updateProgress = useCallback((courseId: string, progress: number, completedModuleId?: string) => {
    if (!user) return;
    const existing = enrollments.find(e => e.courseId === courseId);
    if (!existing) return;
    const course = courses.find(c => c.id === courseId);
    const completedModules = completedModuleId && !existing.completedModules.includes(completedModuleId)
      ? [...existing.completedModules, completedModuleId]
      : existing.completedModules;
    const updated: Enrollment = {
      ...existing,
      progress,
      status: progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started',
      lastAccessedAt: new Date().toISOString(),
      completedModules,
    };
    saveEnrollment(updated);
    if (progress >= 100 && existing.status !== 'completed') {
      addActivity({
        id: generateId(),
        userId: user.id,
        type: 'completed',
        courseId,
        courseTitle: course?.title ?? courseId,
        message: `Completed "${course?.title}"!`,
        timestamp: new Date().toISOString(),
      });
    } else if (completedModuleId) {
      const mod = course?.modules.find(m => m.id === completedModuleId);
      addActivity({
        id: generateId(),
        userId: user.id,
        type: 'progress',
        courseId,
        courseTitle: course?.title ?? courseId,
        message: `Completed module: ${mod?.title ?? completedModuleId}`,
        timestamp: new Date().toISOString(),
      });
    }
    setEnrollments(getUserEnrollments(user.id));
  }, [user, enrollments, courses]);

  const toggleBookmark = useCallback((courseId: string) => {
    if (!user) return;
    const course = courses.find(c => c.id === courseId);
    const isNowBookmarked = storageToggleBookmark(user.id, courseId);
    if (isNowBookmarked && course) {
      addActivity({
        id: generateId(),
        userId: user.id,
        type: 'bookmarked',
        courseId,
        courseTitle: course.title,
        message: `Bookmarked "${course.title}"`,
        timestamp: new Date().toISOString(),
      });
    }
    setBookmarks(getUserBookmarks(user.id));
  }, [user, courses]);

  const isEnrolled = useCallback((courseId: string) =>
    enrollments.some(e => e.courseId === courseId), [enrollments]);

  const isBookmarked = useCallback((courseId: string) =>
    bookmarks.some(b => b.courseId === courseId), [bookmarks]);

  const getEnrollment = useCallback((courseId: string) =>
    enrollments.find(e => e.courseId === courseId), [enrollments]);

  const saveNotes = useCallback((courseId: string, notes: string) => {
    if (!user) return;
    const existing = enrollments.find(e => e.courseId === courseId);
    if (!existing) return;
    const updated = { ...existing, notes };
    saveEnrollment(updated);
    setEnrollments(getUserEnrollments(user.id));
  }, [user, enrollments]);

  return (
    <CourseContext.Provider value={{
      courses, enrollments, bookmarks,
      enroll, updateProgress, toggleBookmark,
      isEnrolled, isBookmarked, getEnrollment, saveNotes, refresh
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourses must be used within CourseProvider');
  return ctx;
}
