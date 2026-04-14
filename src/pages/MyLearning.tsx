import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { BookOpen, Filter } from 'lucide-react';
import { useState } from 'react';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import AppLayout from '../components/layout/AppLayout';

const FILTERS = ['All', 'In Progress', 'Completed', 'Not Started'] as const;

export default function MyLearning() {
  const { courses, enrollments } = useCourses();
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<string>('All');

  const enrolledCourses = useMemo(() => {
    return enrollments
      .filter(e => {
        if (filter === 'All') return true;
        if (filter === 'In Progress') return e.status === 'in-progress';
        if (filter === 'Completed') return e.status === 'completed';
        if (filter === 'Not Started') return e.status === 'not-started';
        return true;
      })
      .map(e => ({ enrollment: e, course: courses.find(c => c.id === e.courseId) }))
      .filter(x => x.course !== undefined);
  }, [enrollments, courses, filter]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">My Learning</h1>
            <p className="text-sm text-muted-foreground mt-1">{enrollments.length} courses enrolled</p>
          </div>
          <button
            onClick={() => setLocation('/courses')}
            className="text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Explore More
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f}
              data-testid={`filter-${f.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                filter === f
                  ? 'bg-primary/20 text-primary border-primary/30'
                  : 'bg-muted text-muted-foreground border-transparent hover:border-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Progress summary */}
        {enrollments.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'In Progress', count: enrollments.filter(e => e.status === 'in-progress').length, color: 'text-blue-400' },
              { label: 'Completed', count: enrollments.filter(e => e.status === 'completed').length, color: 'text-green-400' },
              { label: 'Not Started', count: enrollments.filter(e => e.status === 'not-started').length, color: 'text-muted-foreground' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-card-border rounded-xl p-4 text-center">
                <div className={`text-xl font-extrabold ${s.color}`}>{s.count}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <h3 className="font-semibold text-foreground mb-1">
              {filter === 'All' ? 'No courses enrolled yet' : `No ${filter.toLowerCase()} courses`}
            </h3>
            <p className="text-sm mb-4">
              {filter === 'All' ? 'Start your learning journey by exploring courses' : 'Try a different filter'}
            </p>
            {filter === 'All' && (
              <button onClick={() => setLocation('/courses')} className="text-sm text-primary font-semibold hover:text-primary/80">
                Explore Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {enrolledCourses.map(({ course }) => course && (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
