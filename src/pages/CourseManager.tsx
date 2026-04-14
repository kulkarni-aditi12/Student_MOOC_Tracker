import { useState, useMemo } from 'react';
import { PlusCircle, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { saveCustomCourse, deleteCustomCourse, getAllCourses } from '../lib/storage';
import type { Course, Module } from '../types';
import AppLayout from '../components/layout/AppLayout';

function generateId() {
  return 'custom-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const emptyForm = (): Partial<Course> & { moduleInput: string } => ({
  title: '',
  subtitle: '',
  description: '',
  instructor: '',
  category: 'Web Development',
  level: 'Beginner',
  duration: '',
  thumbnail: '',
  learningUrl: '',
  skills: [],
  modules: [],
  moduleInput: '',
});

export default function CourseManager() {
  const { user } = useAuth();
  const { courses, refresh } = useCourses();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [skillInput, setSkillInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const myCourses = useMemo(() =>
    courses.filter(c => c.createdBy === user?.id || c.createdBy === 'instructor-demo'),
    [courses, user]
  );

  const handleOpen = (course?: Course) => {
    if (course) {
      setEditId(course.id);
      setForm({ ...course, moduleInput: '' });
    } else {
      setEditId(null);
      setForm(emptyForm());
    }
    setSkillInput('');
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditId(null);
    setForm(emptyForm());
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.skills?.includes(skillInput.trim())) {
      setForm(f => ({ ...f, skills: [...(f.skills ?? []), skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills?.filter(s => s !== skill) ?? [] }));
  };

  const addModule = () => {
    if (!form.moduleInput?.trim()) return;
    const mod: Module = {
      id: generateId(),
      title: form.moduleInput.trim(),
      duration: '1h',
      completed: false,
    };
    setForm(f => ({ ...f, modules: [...(f.modules ?? []), mod], moduleInput: '' }));
  };

  const handleSave = () => {
    if (!user || !form.title || !form.category || !form.level) return;
    const course: Course = {
      id: editId ?? generateId(),
      title: form.title!,
      subtitle: form.subtitle ?? '',
      description: form.description ?? '',
      instructor: form.instructor ?? user.name,
      category: form.category as Course['category'],
      level: form.level as Course['level'],
      duration: form.duration ?? '1h',
      thumbnail: form.thumbnail || `https://picsum.photos/seed/${generateId()}/800/450`,
      learningUrl: form.learningUrl ?? '',
      rating: 4.5,
      studentsEnrolled: 0,
      skills: form.skills ?? [],
      modules: form.modules ?? [],
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };
    saveCustomCourse(course);
    refresh();
    handleClose();
  };

  const handleDelete = (id: string) => {
    deleteCustomCourse(id);
    refresh();
    setConfirmDelete(null);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Manage Courses</h1>
            <p className="text-sm text-muted-foreground mt-1">{myCourses.length} courses</p>
          </div>
          <button
            data-testid="button-add-course"
            onClick={() => handleOpen()}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all text-sm"
          >
            <PlusCircle className="w-4 h-4" /> Add Course
          </button>
        </div>

        {myCourses.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <PlusCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <h3 className="font-semibold text-foreground mb-1">No courses yet</h3>
            <p className="text-sm mb-4">Create your first course to get started</p>
            <button onClick={() => handleOpen()} className="text-sm text-primary font-semibold">Create Course</button>
          </div>
        ) : (
          <div className="space-y-3">
            {myCourses.map(course => (
              <div key={course.id} className="bg-card border border-card-border rounded-2xl p-4 flex items-center gap-4">
                <img src={course.thumbnail} alt={course.title} className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground line-clamp-1">{course.title}</div>
                  <div className="text-xs text-muted-foreground">{course.category} · {course.level} · {course.duration}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    data-testid={`button-edit-${course.id}`}
                    onClick={() => handleOpen(course)}
                    className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {confirmDelete === course.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(course.id)} className="w-8 h-8 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center hover:bg-destructive/30">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      data-testid={`button-delete-${course.id}`}
                      onClick={() => setConfirmDelete(course.id)}
                      className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground">{editId ? 'Edit Course' : 'Add New Course'}</h2>
              <button onClick={handleClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Course Title *', key: 'title', placeholder: 'e.g. Complete React Course' },
                { label: 'Subtitle', key: 'subtitle', placeholder: 'Short description' },
                { label: 'Instructor Name', key: 'instructor', placeholder: 'Your name' },
                { label: 'Duration', key: 'duration', placeholder: 'e.g. 12 hours' },
                { label: 'Thumbnail URL', key: 'thumbnail', placeholder: 'https://...' },
                { label: 'Learning URL', key: 'learningUrl', placeholder: 'https://youtube.com/...' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{field.label}</label>
                  <input
                    data-testid={`input-${field.key}`}
                    value={(form as Record<string, unknown>)[field.key] as string ?? ''}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Course description..."
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as Course['category'] }))}
                    className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  >
                    {['Web Development', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design', 'AI/ML'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Level</label>
                  <select
                    value={form.level}
                    onChange={e => setForm(f => ({ ...f, level: e.target.value as Course['level'] }))}
                    className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  >
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                  <button onClick={addSkill} className="px-3 py-2 bg-primary/20 text-primary rounded-xl text-sm font-medium hover:bg-primary/30">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.skills?.map(skill => (
                    <span key={skill} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-destructive"><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modules */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Modules / Lessons</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={form.moduleInput ?? ''}
                    onChange={e => setForm(f => ({ ...f, moduleInput: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addModule())}
                    placeholder="Add a module..."
                    className="flex-1 px-3 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                  <button onClick={addModule} className="px-3 py-2 bg-primary/20 text-primary rounded-xl text-sm font-medium hover:bg-primary/30">Add</button>
                </div>
                {form.modules && form.modules.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {form.modules.map((mod, idx) => (
                      <div key={mod.id} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-xs">
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        <span className="flex-1 text-foreground">{mod.title}</span>
                        <button onClick={() => setForm(f => ({ ...f, modules: f.modules?.filter(m => m.id !== mod.id) ?? [] }))}>
                          <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {!form.title && (
              <div className="flex items-center gap-2 mt-4 text-xs text-yellow-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Course title is required
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                data-testid="button-save-course"
                onClick={handleSave}
                disabled={!form.title}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <Check className="w-4 h-4" />
                {editId ? 'Update Course' : 'Create Course'}
              </button>
              <button onClick={handleClose} className="px-5 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-muted/80 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
