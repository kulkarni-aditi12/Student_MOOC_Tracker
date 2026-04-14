import { Star, Clock, Users, BookOpen, Play, Bookmark, BookmarkCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import type { Course } from '../types';
import { useCourses } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';

const CATEGORY_COLORS: Record<string, string> = {
  'Web Development': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Data Science': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Cloud Computing': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Cybersecurity': 'bg-red-500/20 text-red-300 border-red-500/30',
  'UI/UX Design': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'AI/ML': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const LEVEL_COLORS: Record<string, string> = {
  'Beginner': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Intermediate': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Advanced': 'bg-red-500/20 text-red-300 border-red-500/30',
};

interface CourseCardProps {
  course: Course;
  compact?: boolean;
}

export default function CourseCard({ course, compact = false }: CourseCardProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { isEnrolled, isBookmarked, getEnrollment, enroll, toggleBookmark } = useCourses();

  const enrolled = isEnrolled(course.id);
  const bookmarked = isBookmarked(course.id);
  const enrollment = getEnrollment(course.id);

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setLocation('/login');
      return;
    }
    if (enrolled) {
      setLocation(`/courses/${course.id}`);
    } else {
      enroll(course.id);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    toggleBookmark(course.id);
  };

  const handleCardClick = () => {
    setLocation(`/courses/${course.id}`);
  };

  return (
    <div
      data-testid={`card-course-${course.id}`}
      onClick={handleCardClick}
      className="group relative bg-card border border-card-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/30"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[course.category] ?? 'bg-gray-500/20 text-gray-300'}`}>
            {course.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${LEVEL_COLORS[course.level] ?? ''}`}>
            {course.level}
          </span>
          {user && (
            <button
              data-testid={`button-bookmark-${course.id}`}
              onClick={handleBookmark}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              {bookmarked
                ? <BookmarkCheck className="w-4 h-4 text-primary" />
                : <Bookmark className="w-4 h-4 text-white" />}
            </button>
          )}
        </div>
        {enrolled && enrollment && (
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex items-center justify-between text-xs text-white/80 mb-1.5">
              <span>{enrollment.status === 'completed' ? 'Completed' : 'In Progress'}</span>
              <span>{enrollment.progress}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        {!compact && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.subtitle}</p>
        )}
        <div className="flex items-center gap-1 mb-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">{course.instructor[0]}</span>
          </div>
          <span className="text-xs text-muted-foreground">{course.instructor}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-foreground font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{(course.studentsEnrolled / 1000).toFixed(0)}k</span>
          </div>
        </div>

        <button
          data-testid={`button-enroll-${course.id}`}
          onClick={handleEnroll}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            enrolled
              ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
              : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5'
          }`}
        >
          {enrolled ? (
            <>
              <BookOpen className="w-4 h-4" />
              Continue Learning
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Enroll Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
