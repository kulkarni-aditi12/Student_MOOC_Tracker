import type { User, Course, Enrollment, Bookmark, Activity } from '../types';
import { sampleCourses } from '../data/courses';

const KEYS = {
  USERS: 'mooc_users',
  SESSION: 'mooc_session',
  ENROLLMENTS: 'mooc_enrollments',
  BOOKMARKS: 'mooc_bookmarks',
  ACTIVITY: 'mooc_activity',
  CUSTOM_COURSES: 'mooc_courses_custom',
};

function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEMO_IDS = ['student-demo', 'instructor-demo'];

export function initDefaults(): void {
  // Remove any leftover demo accounts and their data
  const users = get<User[]>(KEYS.USERS) ?? [];
  const cleaned = users.filter(u => !DEMO_IDS.includes(u.id));
  set(KEYS.USERS, cleaned);

  const enrollments = get<Enrollment[]>(KEYS.ENROLLMENTS) ?? [];
  set(KEYS.ENROLLMENTS, enrollments.filter(e => !DEMO_IDS.includes(e.userId)));

  const bookmarks = get<Bookmark[]>(KEYS.BOOKMARKS) ?? [];
  set(KEYS.BOOKMARKS, bookmarks.filter(b => !DEMO_IDS.includes(b.userId)));

  const activity = get<Activity[]>(KEYS.ACTIVITY) ?? [];
  set(KEYS.ACTIVITY, activity.filter(a => !DEMO_IDS.includes(a.userId)));

  // If the active session belonged to a demo account, clear it
  const session = get<{ userId: string }>(KEYS.SESSION);
  if (session && DEMO_IDS.includes(session.userId)) {
    localStorage.removeItem(KEYS.SESSION);
  }
}

export function getUsers(): User[] {
  return get<User[]>(KEYS.USERS) ?? [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  set(KEYS.USERS, users);
}

export function getSession(): { userId: string; role: 'student' | 'instructor' } | null {
  return get(KEYS.SESSION);
}

export function setSession(userId: string, role: 'student' | 'instructor'): void {
  set(KEYS.SESSION, { userId, role });
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION);
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return getUsers().find(u => u.id === session.userId) ?? null;
}

export function getAllCourses(): Course[] {
  const custom = get<Course[]>(KEYS.CUSTOM_COURSES) ?? [];
  return [...sampleCourses, ...custom];
}

export function saveCustomCourse(course: Course): void {
  const custom = get<Course[]>(KEYS.CUSTOM_COURSES) ?? [];
  const idx = custom.findIndex(c => c.id === course.id);
  if (idx >= 0) custom[idx] = course;
  else custom.push(course);
  set(KEYS.CUSTOM_COURSES, custom);
}

export function deleteCustomCourse(courseId: string): void {
  const custom = get<Course[]>(KEYS.CUSTOM_COURSES) ?? [];
  set(KEYS.CUSTOM_COURSES, custom.filter(c => c.id !== courseId));
}

export function getEnrollments(): Enrollment[] {
  return get<Enrollment[]>(KEYS.ENROLLMENTS) ?? [];
}

export function getUserEnrollments(userId: string): Enrollment[] {
  return getEnrollments().filter(e => e.userId === userId);
}

export function getEnrollment(userId: string, courseId: string): Enrollment | null {
  return getEnrollments().find(e => e.userId === userId && e.courseId === courseId) ?? null;
}

export function saveEnrollment(enrollment: Enrollment): void {
  const enrollments = getEnrollments();
  const idx = enrollments.findIndex(e => e.userId === enrollment.userId && e.courseId === enrollment.courseId);
  if (idx >= 0) enrollments[idx] = enrollment;
  else enrollments.push(enrollment);
  set(KEYS.ENROLLMENTS, enrollments);
}

export function getBookmarks(): Bookmark[] {
  return get<Bookmark[]>(KEYS.BOOKMARKS) ?? [];
}

export function getUserBookmarks(userId: string): Bookmark[] {
  return getBookmarks().filter(b => b.userId === userId);
}

export function toggleBookmark(userId: string, courseId: string): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.findIndex(b => b.userId === userId && b.courseId === courseId);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    set(KEYS.BOOKMARKS, bookmarks);
    return false;
  } else {
    bookmarks.push({ userId, courseId, savedAt: new Date().toISOString() });
    set(KEYS.BOOKMARKS, bookmarks);
    return true;
  }
}

export function isBookmarked(userId: string, courseId: string): boolean {
  return getBookmarks().some(b => b.userId === userId && b.courseId === courseId);
}

export function getActivity(): Activity[] {
  return get<Activity[]>(KEYS.ACTIVITY) ?? [];
}

export function getUserActivity(userId: string): Activity[] {
  return getActivity()
    .filter(a => a.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function addActivity(activity: Activity): void {
  const all = getActivity();
  all.unshift(activity);
  set(KEYS.ACTIVITY, all.slice(0, 100));
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
