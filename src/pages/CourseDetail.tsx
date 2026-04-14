import { useState, useMemo } from 'react';
import { useRoute, useLocation } from 'wouter';
import {
  ArrowLeft, Star, Clock, Users, Bookmark, BookmarkCheck,
  CheckCircle, Circle, ExternalLink, Tag
} from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { saveEnrollment } from '../lib/storage';
import AppLayout from '../components/layout/AppLayout';

export default function CourseDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/courses/:id');
  const { user } = useAuth();
  const { courses, isEnrolled, isBookmarked, getEnrollment, enroll, toggleBookmark, updateProgress, saveNotes } = useCourses();

  const course = useMemo(() => courses.find(c => c.id === params?.id), [courses, params?.id]);
  const enrolled = course ? isEnrolled(course.id) : false;
  const bookmarked = course ? isBookmarked(course.id) : false;
  const enrollment = course ? getEnrollment(course.id) : undefined;
  const [notes, setNotes] = useState(enrollment?.notes ?? '');
  const [notesSaved, setNotesSaved] = useState(false);

  if (!match || !course) {
    return (
      <AppLayout>
        <div className="text-center py-20 text-muted-foreground">
          <h2 className="font-bold text-foreground mb-2">Course not found</h2>
          <button onClick={() => setLocation('/courses')} className="text-primary text-sm">Back to courses</button>
        </div>
      </AppLayout>
    );
  }

  const relatedCourses = courses.filter(c => c.category === course.category && c.id !== course.id).slice(0, 3);

  const handleEnroll = () => {
    if (!user) { setLocation('/login'); return; }
    if (!enrolled) enroll(course.id);
  };

  const handleModuleToggle = (moduleId: string) => {
    if (!enrolled || !enrollment) return;
    const isComplete = enrollment.completedModules.includes(moduleId);
    const newCompleted = isComplete
      ? enrollment.completedModules.filter(id => id !== moduleId)
      : [...enrollment.completedModules, moduleId];
    const progress = Math.round((newCompleted.length / course.modules.length) * 100);
    if (!isComplete) {
      updateProgress(course.id, progress, moduleId);
    } else {
      saveEnrollment({ ...enrollment, completedModules: newCompleted, progress });
    }
  };

  const handleSaveNotes = () => {
    if (!enrollment) return;
    saveNotes(course.id, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const CATEGORY_COLORS: Record<string, string> = {
    'Web Development': 'bg-blue-500/20 text-blue-300',
    'Data Science': 'bg-cyan-500/20 text-cyan-300',
    'Cloud Computing': 'bg-orange-500/20 text-orange-300',
    'Cybersecurity': 'bg-red-500/20 text-red-300',
    'UI/UX Design': 'bg-pink-500/20 text-pink-300',
    'AI/ML': 'bg-purple-500/20 text-purple-300',
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          data-testid="button-back"
          onClick={() => setLocation('/courses')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </button>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl aspect-video">
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex gap-2 mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[course.category] ?? 'bg-gray-500/20 text-gray-300'}`}>
                {course.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white">{course.level}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">{course.title}</h1>
            <p className="text-sm text-white/70">{course.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Course info */}
            <div className="bg-card border border-card-border rounded-2xl p-6">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-foreground">{course.rating}</span>
                  <span>({(course.studentsEnrolled / 1000).toFixed(0)}k students)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {course.duration}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {course.studentsEnrolled.toLocaleString()} enrolled
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{course.description}</p>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
                  {course.instructor[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{course.instructor}</div>
                  <div className="text-xs text-muted-foreground">Course Instructor</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-card border border-card-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Skills You'll Learn
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.skills.map(skill => (
                  <span key={skill} className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Modules */}
            <div className="bg-card border border-card-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground mb-4">Course Content</h2>
              <div className="space-y-2">
                {course.modules.map((mod, idx) => {
                  const isComplete = enrollment?.completedModules.includes(mod.id) ?? false;
                  return (
                    <div
                      key={mod.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        enrolled ? 'cursor-pointer hover:bg-muted' : 'opacity-70'
                      } ${isComplete ? 'bg-green-500/5 border border-green-500/20' : 'bg-muted/50'}`}
                      onClick={() => enrolled && handleModuleToggle(mod.id)}
                    >
                      {isComplete
                        ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        : <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isComplete ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {idx + 1}. {mod.title}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{mod.duration}</span>
                    </div>
                  );
                })}
              </div>
              {!enrolled && (
                <p className="text-xs text-center text-muted-foreground mt-3">Enroll to track module completion</p>
              )}
            </div>

            {/* Notes */}
            {enrolled && (
              <div className="bg-card border border-card-border rounded-2xl p-6">
                <h2 className="font-bold text-foreground mb-3">My Notes</h2>
                <textarea
                  data-testid="textarea-notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Write your notes here..."
                  rows={5}
                  className="w-full p-3 bg-muted border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
                />
                <button
                  data-testid="button-save-notes"
                  onClick={handleSaveNotes}
                  className={`mt-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    notesSaved ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary hover:bg-primary/30'
                  }`}
                >
                  {notesSaved ? 'Saved!' : 'Save Notes'}
                </button>
              </div>
            )}

            {/* Related */}
            {relatedCourses.length > 0 && (
              <div className="bg-card border border-card-border rounded-2xl p-6">
                <h2 className="font-bold text-foreground mb-4">Related Courses</h2>
                <div className="space-y-3">
                  {relatedCourses.map(rc => (
                    <div
                      key={rc.id}
                      onClick={() => setLocation(`/courses/${rc.id}`)}
                      className="flex gap-3 p-2.5 rounded-xl hover:bg-muted cursor-pointer transition-colors"
                    >
                      <img src={rc.thumbnail} alt={rc.title} className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{rc.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <Star className="w-3 h-3 text-yellow-400" /> {rc.rating} · {rc.duration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-card border border-card-border rounded-2xl p-5 space-y-4">
              {enrolled && enrollment && (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold text-foreground">{enrollment.progress}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5 text-center capitalize">{enrollment.status.replace('-', ' ')}</div>
                </div>
              )}

              <a
                data-testid="link-start-learning"
                href={course.learningUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={!enrolled ? (e) => { e.preventDefault(); handleEnroll(); } : undefined}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
              >
                <ExternalLink className="w-4 h-4" />
                {enrolled ? 'Start Learning' : 'Enroll & Learn'}
              </a>

              {!enrolled && (
                <button
                  data-testid="button-enroll"
                  onClick={handleEnroll}
                  className="w-full py-3 rounded-xl border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/10 transition-all"
                >
                  Enroll for Free
                </button>
              )}

              {user && (
                <button
                  data-testid="button-bookmark"
                  onClick={() => toggleBookmark(course.id)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    bookmarked
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {bookmarked ? 'Bookmarked' : 'Save for Later'}
                </button>
              )}

              <div className="space-y-2 pt-2 border-t border-border">
                {[
                  { label: 'Category', value: course.category },
                  { label: 'Level', value: course.level },
                  { label: 'Duration', value: course.duration },
                  { label: 'Students', value: course.studentsEnrolled.toLocaleString() },
                  { label: 'Modules', value: `${course.modules.length} lessons` },
                ].map(item => (
                  <div key={item.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">{item.value}</span>
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
