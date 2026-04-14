import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, X, Check, ExternalLink, Trash2, ChevronDown, ChevronUp, BookOpen, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';

/* ── Types ── */
interface TrackedModule { id: string; title: string; done: boolean }
interface TrackedCourse {
  id: string;
  userId: string;
  title: string;
  url: string;
  modules: TrackedModule[];
  notes: string;
  createdAt: string;
}

/* ── Storage ── */
const KEY = 'mooc_student_tracked';
function load(userId: string): TrackedCourse[] {
  try { return (JSON.parse(localStorage.getItem(KEY) ?? '[]') as TrackedCourse[]).filter(c => c.userId === userId); }
  catch { return []; }
}
function saveAll(userId: string, courses: TrackedCourse[]) {
  try {
    const others = (JSON.parse(localStorage.getItem(KEY) ?? '[]') as TrackedCourse[]).filter(c => c.userId !== userId);
    localStorage.setItem(KEY, JSON.stringify([...others, ...courses]));
  } catch {}
}
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

/* ── Empty form state ── */
const emptyForm = () => ({ title: '', url: '', moduleInput: '', modules: [] as TrackedModule[] });

/* ── Progress bar ── */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function StudentCourseTracker() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<TrackedCourse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  useEffect(() => { if (user) setCourses(load(user.id)); }, [user]);

  const persist = useCallback((updated: TrackedCourse[]) => {
    if (!user) return;
    setCourses(updated);
    saveAll(user.id, updated);
  }, [user]);

  /* add module to form */
  const addModule = () => {
    const t = form.moduleInput.trim();
    if (!t) return;
    setForm(f => ({ ...f, modules: [...f.modules, { id: uid(), title: t, done: false }], moduleInput: '' }));
  };

  /* save new course */
  const handleSave = () => {
    if (!user || !form.title.trim()) return;
    const newCourse: TrackedCourse = {
      id: uid(),
      userId: user.id,
      title: form.title.trim(),
      url: form.url.trim(),
      modules: form.modules,
      notes: '',
      createdAt: new Date().toISOString(),
    };
    persist([...courses, newCourse]);
    setForm(emptyForm());
    setShowForm(false);
    setExpanded(newCourse.id);
  };

  /* toggle module done */
  const toggleModule = (courseId: string, moduleId: string) => {
    persist(courses.map(c =>
      c.id !== courseId ? c :
        { ...c, modules: c.modules.map(m => m.id === moduleId ? { ...m, done: !m.done } : m) }
    ));
  };

  /* delete course */
  const deleteCourse = (courseId: string) => {
    persist(courses.filter(c => c.id !== courseId));
    setConfirmDel(null);
    if (expanded === courseId) setExpanded(null);
  };

  /* save note */
  const saveNote = (courseId: string) => {
    persist(courses.map(c => c.id === courseId ? { ...c, notes: noteText } : c));
    setEditingNote(null);
  };

  const progress = (c: TrackedCourse) =>
    c.modules.length === 0 ? 0 : Math.round((c.modules.filter(m => m.done).length / c.modules.length) * 100);

  const totalProgress = courses.length === 0 ? 0 :
    Math.round(courses.reduce((s, c) => s + progress(c), 0) / courses.length);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">My Course Tracker</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Add any course from anywhere and track your progress</p>
          </div>
          <button
            data-testid="button-add-tracked-course"
            onClick={() => { setShowForm(true); setForm(emptyForm()); }}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all text-sm"
          >
            <PlusCircle className="w-4 h-4" /> Add Course
          </button>
        </div>

        {/* Summary strip */}
        {courses.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Tracking', value: courses.length, color: 'text-primary' },
              { label: 'Completed', value: courses.filter(c => progress(c) === 100).length, color: 'text-green-500' },
              { label: 'Avg Progress', value: `${totalProgress}%`, color: 'text-accent' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-card-border rounded-2xl p-4 text-center">
                <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {courses.length === 0 && !showForm && (
          <div className="text-center py-20 bg-card border border-card-border rounded-2xl">
            <Target className="w-12 h-12 mx-auto mb-3 text-primary/30" />
            <h3 className="font-semibold text-foreground mb-1">No courses tracked yet</h3>
            <p className="text-sm text-muted-foreground mb-5">Add any course — YouTube, Coursera, Udemy, anything — and track your progress module by module.</p>
            <button onClick={() => setShowForm(true)} className="text-sm text-primary font-semibold hover:underline">
              + Add your first course
            </button>
          </div>
        )}

        {/* Course cards */}
        {courses.map(course => {
          const pct = progress(course);
          const isExpanded = expanded === course.id;
          const done = pct === 100;

          return (
            <div key={course.id} className="bg-card border border-card-border rounded-2xl overflow-hidden">
              {/* Card header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {done && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/20">Completed ✓</span>}
                      <h3 className="font-bold text-foreground line-clamp-1">{course.title}</h3>
                    </div>
                    {course.url && (
                      <a href={course.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        <ExternalLink className="w-3 h-3" /> Open course
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : course.id)}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {confirmDel === course.id ? (
                      <>
                        <button onClick={() => deleteCourse(course.id)} className="w-8 h-8 rounded-lg bg-destructive/15 text-destructive flex items-center justify-center hover:bg-destructive/25">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setConfirmDel(null)} className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDel(course.id)} className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                  <ProgressBar value={pct} />
                  <span className="text-sm font-bold text-foreground w-10 text-right flex-shrink-0">{pct}%</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {course.modules.filter(m => m.done).length} / {course.modules.length} modules done
                </div>
              </div>

              {/* Expanded: modules + notes */}
              {isExpanded && (
                <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">

                  {/* Modules list */}
                  {course.modules.length > 0 ? (
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Modules</div>
                      <div className="space-y-1.5">
                        {course.modules.map(mod => (
                          <button
                            key={mod.id}
                            onClick={() => toggleModule(course.id, mod.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                              mod.done ? 'bg-primary/8 border border-primary/20' : 'bg-muted border border-transparent hover:border-border'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              mod.done ? 'border-primary bg-primary' : 'border-border'
                            }`}>
                              {mod.done && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm flex-1 ${mod.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {mod.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-3 bg-muted rounded-xl">
                      No modules added — progress can't be tracked yet
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Notes</div>
                    {editingNote === course.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          rows={3}
                          placeholder="Your notes about this course..."
                          className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => saveNote(course.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/15 text-primary text-xs font-semibold rounded-lg hover:bg-primary/25">
                            <Check className="w-3 h-3" /> Save
                          </button>
                          <button onClick={() => setEditingNote(null)} className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-semibold rounded-lg">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => { setEditingNote(course.id); setNoteText(course.notes); }}
                        className="min-h-[40px] px-3 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground cursor-text hover:border-primary/30 transition-colors"
                      >
                        {course.notes || <span className="text-muted-foreground">Click to add notes...</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Course Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground">Track a New Course</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Course Title *</label>
                <input
                  data-testid="input-tracked-title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. React Complete Guide on Udemy"
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Course URL (optional)</label>
                <input
                  data-testid="input-tracked-url"
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Modules / Lessons <span className="text-muted-foreground/60">(add each one)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    data-testid="input-module-name"
                    value={form.moduleInput}
                    onChange={e => setForm(f => ({ ...f, moduleInput: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addModule())}
                    placeholder="e.g. Introduction to React"
                    className="flex-1 px-3 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                  <button onClick={addModule} className="px-3 py-2 bg-primary/15 text-primary rounded-xl text-sm font-medium hover:bg-primary/25 transition-colors">Add</button>
                </div>
                {form.modules.length > 0 && (
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {form.modules.map((m, i) => (
                      <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-xs">
                        <BookOpen className="w-3 h-3 text-primary flex-shrink-0" />
                        <span className="flex-1 text-foreground">{i + 1}. {m.title}</span>
                        <button onClick={() => setForm(f => ({ ...f, modules: f.modules.filter(x => x.id !== m.id) }))}>
                          <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {!form.title.trim() && (
              <p className="text-xs text-muted-foreground mt-3">* Course title is required</p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                data-testid="button-save-tracked-course"
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <Check className="w-4 h-4" /> Start Tracking
              </button>
              <button onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-muted/80">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
