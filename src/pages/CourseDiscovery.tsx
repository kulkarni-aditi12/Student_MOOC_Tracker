import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';
import AppLayout from '../components/layout/AppLayout';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'AI/ML', 'Cloud Computing', 'UI/UX Design', 'Cybersecurity'] as const;
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;
const SORTS = ['Popular', 'Newest', 'Highest Rated'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  'All': 'bg-primary/20 text-primary border-primary/30',
  'Web Development': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Data Science': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'AI/ML': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Cloud Computing': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'UI/UX Design': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Cybersecurity': 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function CourseDiscovery() {
  const { courses } = useCourses();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [level, setLevel] = useState<string>('All');
  const [sort, setSort] = useState<string>('Popular');

  const filtered = useMemo<Course[]>(() => {
    let result = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (level !== 'All') result = result.filter(c => c.level === level);
    if (sort === 'Popular') result.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
    else if (sort === 'Newest') result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sort === 'Highest Rated') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [courses, search, category, level, sort]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Discover Courses</h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} courses available</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              data-testid="input-search-courses"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, instructors, topics..."
              className="w-full pl-11 pr-10 py-3 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  data-testid={`filter-category-${cat}`}
                  onClick={() => setCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    category === cat
                      ? CATEGORY_COLORS[cat] ?? 'bg-primary/20 text-primary border-primary/30'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1.5">
              {LEVELS.map(lv => (
                <button
                  key={lv}
                  data-testid={`filter-level-${lv}`}
                  onClick={() => setLevel(lv)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    level === lv
                      ? 'bg-secondary/20 text-secondary border-secondary/30'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 ml-auto">
              {SORTS.map(s => (
                <button
                  key={s}
                  data-testid={`sort-${s.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSort(s)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                    sort === s
                      ? 'bg-accent/20 text-accent border-accent/30'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-border'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <h3 className="font-semibold text-foreground mb-1">No courses found</h3>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
