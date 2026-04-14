import { useLocation } from 'wouter';
import { Bookmark } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import AppLayout from '../components/layout/AppLayout';

export default function Bookmarks() {
  const { courses, bookmarks } = useCourses();
  const [, setLocation] = useLocation();

  const bookmarkedCourses = bookmarks
    .map(b => courses.find(c => c.id === b.courseId))
    .filter(Boolean);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Bookmarks</h1>
            <p className="text-sm text-muted-foreground mt-1">{bookmarkedCourses.length} saved courses</p>
          </div>
        </div>

        {bookmarkedCourses.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <h3 className="font-semibold text-foreground mb-1">No bookmarks yet</h3>
            <p className="text-sm mb-4">Save courses to revisit them later</p>
            <button onClick={() => setLocation('/courses')} className="text-sm text-primary font-semibold">
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bookmarkedCourses.map(course => course && (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
