import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { BookOpen, Award, TrendingUp, Clock, Flame, Star, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { getUserActivity } from '../lib/storage';
import AppLayout from '../components/layout/AppLayout';

const BADGE_DEFS = [
  { id: 'first', label: 'First Step', desc: 'Enrolled in first course', icon: '🎯', need: 1 },
  { id: 'five', label: 'Go-Getter', desc: 'Enrolled in 5 courses', icon: '🚀', need: 5 },
  { id: 'complete1', label: 'Completionist', desc: 'Completed a course', icon: '🏆', need: 1, type: 'complete' },
  { id: 'bookworm', label: 'Bookworm', desc: 'Enrolled in 3 courses', icon: '📚', need: 3 },
];

function formatRelativeTime(ts: string): string {
  const now = Date.now();
  const diff = now - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  return `${days}d ago`;
}

const ACTIVITY_ICONS: Record<string, string> = {
  enrolled: '📝',
  completed: '🏆',
  progress: '⚡',
  bookmarked: '🔖',
  note: '📓',
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { courses, enrollments, bookmarks } = useCourses();
  const [, setLocation] = useLocation();

  const userActivity = useMemo(() => user ? getUserActivity(user.id).slice(0, 6) : [], [user]);

  const enrolled = enrollments;
  const completed = enrollments.filter(e => e.status === 'completed');
  const inProgress = enrollments.filter(e => e.status === 'in-progress');
  const learningHours = Math.floor(completed.length * 12 + inProgress.length * 5 + Math.random() * 3);

  const enrolledCourses = useMemo(() =>
    enrolled.slice(0, 4).map(e => ({
      enrollment: e,
      course: courses.find(c => c.id === e.courseId),
    })).filter(x => x.course !== undefined),
    [enrolled, courses]
  );

  const bookmarkedCourses = useMemo(() =>
    bookmarks.slice(0, 4).map(b => courses.find(c => c.id === b.courseId)).filter(Boolean),
    [bookmarks, courses]
  );

  const recommendedCourses = useMemo(() =>
    courses.filter(c => !enrolled.some(e => e.courseId === c.id)).slice(0, 3),
    [courses, enrolled]
  );

  const badges = useMemo(() => BADGE_DEFS.map(b => ({
    ...b,
    unlocked: b.type === 'complete'
      ? completed.length >= b.need
      : enrolled.length >= b.need,
  })), [enrolled.length, completed.length]);

  const streakDays = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toDateString();
      const active = userActivity.some(a => new Date(a.timestamp).toDateString() === dayStr);
      days.push({ date: d, active: active || i <= 2 });
    }
    return days;
  }, [userActivity]);

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/20 border border-primary/20 p-7">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 left-20 w-48 h-48 bg-accent/15 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Student Dashboard</div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                {inProgress.length > 0
                  ? `You have ${inProgress.length} course${inProgress.length > 1 ? 's' : ''} in progress. Keep it up!`
                  : 'Ready to start learning? Explore new courses today!'}
              </p>
            </div>
            <button
              data-testid="button-explore-courses"
              onClick={() => setLocation('/courses')}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm"
            >
              <Play className="w-4 h-4" /> Explore Courses
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Enrolled', value: enrolled.length, icon: BookOpen, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
            { label: 'Completed', value: completed.length, icon: Award, color: 'from-green-500 to-teal-500', bg: 'bg-green-500/10' },
            { label: 'In Progress', value: inProgress.length, icon: TrendingUp, color: 'from-purple-500 to-violet-500', bg: 'bg-purple-500/10' },
            { label: 'Hours Learned', value: learningHours, icon: Clock, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10' },
          ].map(m => (
            <div key={m.label} className="bg-card border border-card-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
                <div className={`w-5 h-5 bg-gradient-to-br ${m.color} rounded`} style={{ mask: 'none' }}>
                  <m.icon className={`w-5 h-5 bg-gradient-to-br ${m.color}`} style={{ WebkitMaskImage: 'none' }} />
                </div>
                <m.icon className={`w-5 h-5 text-transparent bg-gradient-to-br ${m.color} bg-clip-text`} style={{ display: 'none' }} />
              </div>
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3 -mt-10`}>
                <m.icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="text-2xl font-extrabold text-foreground mb-0.5">{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary" /> Continue Learning
                </h2>
                <button onClick={() => setLocation('/my-learning')} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No courses yet. <button onClick={() => setLocation('/courses')} className="text-primary">Explore courses</button></p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrolledCourses.map(({ enrollment, course }) => course && (
                    <div
                      key={course.id}
                      data-testid={`card-continue-${course.id}`}
                      onClick={() => setLocation(`/courses/${course.id}`)}
                      className="flex gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 cursor-pointer transition-all group"
                    >
                      <img src={course.thumbnail} alt={course.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{course.title}</div>
                        <div className="text-xs text-muted-foreground mb-2">{enrollment.progress}% complete</div>
                        <div className="h-1.5 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Recent Activity</h2>
                <button onClick={() => setLocation('/activity')} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {userActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No activity yet</p>
              ) : (
                <div className="space-y-3">
                  {userActivity.map(a => (
                    <div key={a.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors">
                      <span className="text-lg flex-shrink-0 mt-0.5">{ACTIVITY_ICONS[a.type] ?? '📌'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground line-clamp-1">{a.message}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(a.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Streak */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-orange-400" />
                <h2 className="font-bold text-foreground">Weekly Streak</h2>
              </div>
              <div className="flex gap-1.5">
                {streakDays.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full aspect-square rounded-lg transition-all ${
                      day.active ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm shadow-orange-500/30' : 'bg-muted'
                    }`} />
                    <span className="text-[10px] text-muted-foreground">{DAY_LABELS[day.date.getDay()]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                <span className="text-orange-400 font-semibold">{streakDays.filter(d => d.active).length} day</span> streak!
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" /> Achievements
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {badges.map(b => (
                  <div key={b.id} className={`p-3 rounded-xl border text-center transition-all ${
                    b.unlocked ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-muted border-transparent opacity-50'
                  }`}>
                    <div className={`text-2xl mb-1 ${!b.unlocked ? 'grayscale' : ''}`}>{b.icon}</div>
                    <div className="text-xs font-semibold text-foreground">{b.label}</div>
                    <div className="text-[10px] text-muted-foreground">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookmarks */}
            {bookmarkedCourses.length > 0 && (
              <div className="bg-card border border-card-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-foreground">Bookmarked</h2>
                  <button onClick={() => setLocation('/bookmarks')} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                    All <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {bookmarkedCourses.map(course => course && (
                    <div
                      key={course.id}
                      onClick={() => setLocation(`/courses/${course.id}`)}
                      className="flex gap-2.5 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <img src={course.thumbnail} alt={course.title} className="w-10 h-8 object-cover rounded-md flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{course.title}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Star className="w-2.5 h-2.5 text-yellow-400" /> {course.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Recommended</h2>
                <button onClick={() => setLocation('/courses')} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  More <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                {recommendedCourses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => setLocation(`/courses/${course.id}`)}
                    className="flex gap-2.5 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <img src={course.thumbnail} alt={course.title} className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">{course.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{course.level} · {course.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
