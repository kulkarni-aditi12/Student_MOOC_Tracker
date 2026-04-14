export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // stored as-is (frontend only, no security concern)
  role: 'student' | 'instructor';
  avatar?: string;
  joinedAt: string;
  bio?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructor: string;
  category: 'Web Development' | 'Data Science' | 'Cloud Computing' | 'Cybersecurity' | 'UI/UX Design' | 'AI/ML';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g., "12 hours"
  thumbnail: string; // URL from picsum or unsplash
  learningUrl: string; // YouTube or other learning link
  rating: number; // 1-5
  studentsEnrolled: number;
  skills: string[]; // skills learned
  modules: Module[];
  createdAt: string;
  createdBy: string; // user ID of instructor
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed';
  lastAccessedAt?: string;
  notes: string;
  completedModules: string[]; // module IDs
}

export interface Bookmark {
  userId: string;
  courseId: string;
  savedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'enrolled' | 'completed' | 'progress' | 'bookmarked' | 'note';
  courseId: string;
  courseTitle: string;
  message: string;
  timestamp: string;
}
