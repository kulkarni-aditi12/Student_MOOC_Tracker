import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { Users, BookOpen, TrendingUp, Award, PlusCircle, ChevronRight, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { getEnrollments, getUserActivity } from '../lib/storage';
import AppLayout from '../components/layout/AppLayout';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [, setLocation] = useLocation();

  const myCourses = useMemo(() =>
    courses.filter(c => c.createdBy === user?.id || c.createdBy === 'instructor-demo'),
    [courses, user]
  );

  const allEnrollments = useMemo(() => getEnrollments(), []);
  const activity = useMemo(() => user ? getUserActivity(user.id).slice(0, 5) : [], [user]);

  const totalStudents = useMemo(() => {
    const courseIds = new Set(myCourses.map(c => c.id));
    return allEnrollments.filter(e => courseIds.has(e.courseId)).length;
  }, [myCourses, allEnrollments]);

  const avgCompletion = useMemo(() => {
    const courseIds = new Set(myCourses.map(c => c.id));
    const relevant = allEnrollments.filter(e => courseIds.has(e.courseId));
    if (relevant.length === 0) return 0;
    return Math.round(relevant.reduce((sum, e) => sum + e.progress, 0) / relevant.length);
  }, [myCourses, allEnrollments]);

  const activeLearners = useMemo(() => {
    const courseIds = new Set(myCourses.map(c => c.id));
    return allEnrollments.filter(e => courseIds.has(e.courseId) && e.status === 'in-progress').length;
  }, [myCourses, allEnrollments]);

  const courseStats = useMemo(() =>
    myCourses.map(c => {
      const enrs = allEnrollments.filter(e => e.courseId === c.id);
      const completed = enrs.filter(e => e.status === 'completed').length;
      const avgProg = enrs.length > 0
        ? Math.round(enrs.reduce((s, e) => s + e.progress, 0) / enrs.length)
        : 0;
      return { course: c, enrollments: enrs.length, completed, avgProgress: avgProg };
    }),
    [myCourses, allEnrollments]
  );

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/30 via-primary/20 to-secondary/20 border border-accent/20 p-7">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 left-20 w-48 h-48 bg-primary/15 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">Instructor Dashboard</div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-muted-foreground text-sm mt-1.5">
                You have {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} reaching {totalStudents} student{totalStudents !== 1 ? 's' : ''}.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                data-testid="button-manage-courses"
                onClick={() => setLocation('/manage-courses')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 text-sm"
              >
                <PlusCircle className="w-4 h-4" /> Manage Courses
              </button>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: totalStudents, icon: Users, bg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
            { label: 'Total Courses', value: myCourses.length, icon: BookOpen, bg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
            { label: 'Active Learners', value: activeLearners, icon: TrendingUp, bg: 'bg-green-500/10', iconColor: 'text-green-400' },
            { label: 'Avg Completion', value: `${avgCompletion}%`, icon: Award, bg: 'bg-orange-500/10', iconColor: 'text-orange-400' },
          ].map(m => (
            <div key={m.label} className="bg-card border border-card-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
                <m.icon className={`w-5 h-5 ${m.iconColor}`} />
              </div>
              <div className="text-2xl font-extrabold text-foreground mb-0.5">{m.value}</div>
              <div className="text-xs text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Analytics */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary" /> Course Analytics
                </h2>
                <button onClick={() => setLocation('/manage-courses')} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  Manage <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {courseStats.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm mb-3">No courses yet.</p>
                  <button onClick={() => setLocation('/manage-courses')} className="text-sm text-primary font-semibold">Create your first course</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courseStats.map(({ course, enrollments: enrCount, completed, avgProgress }) => (
                    <div key={course.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                      <img src={course.thumbnail} alt={course.title} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground line-clamp-1">{course.title}</div>
                        <div className="text-xs text-muted-foreground mb-1.5">{course.category} · {course.level}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${avgProgress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{avgProgress}% avg</span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-center flex-shrink-0">
                        <div>
                          <div className="text-sm font-bold text-foreground">{enrCount}</div>
                          <div className="text-[10px] text-muted-foreground">Students</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-green-400">{completed}</div>
                          <div className="text-[10px] text-muted-foreground">Completed</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <h2 className="font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-2.5">
                <button
                  onClick={() => setLocation('/manage-courses')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 hover:border-primary/40 transition-all text-left group"
                >
                  <PlusCircle className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Add New Course</div>
                    <div className="text-xs text-muted-foreground">Create and publish a course</div>
                  </div>
                </button>
                <button
                  onClick={() => setLocation('/courses')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 border border-transparent hover:border-border transition-all text-left"
                >
                  <BookOpen className="w-4.5 h-4.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Browse All Courses</div>
                    <div className="text-xs text-muted-foreground">Explore the course library</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Recent Activity</h2>
                <button onClick={() => setLocation('/activity')} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                  All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {activity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              ) : (
                <div className="space-y-3">
                  {activity.map(a => (
                    <div key={a.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground line-clamp-2 leading-snug">{a.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Performance */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <h2 className="font-bold text-foreground mb-4">Performance</h2>
              <div className="space-y-3">
                {[
                  { label: 'Student Satisfaction', value: 92 },
                  { label: 'Course Completion', value: avgCompletion },
                  { label: 'Content Quality', value: 88 },
                ].map(p => (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{p.label}</span>
                      <span className="text-foreground font-semibold">{p.value}%</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${p.value}%` }} />
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
