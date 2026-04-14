import { useState } from 'react';
import { User, Mail, Calendar, BookOpen, Award, Edit3, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { saveUser } from '../lib/storage';
import AppLayout from '../components/layout/AppLayout';

export default function Profile() {
  const { user, refresh } = useAuth();
  const { enrollments } = useCourses();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const completed = enrollments.filter(e => e.status === 'completed').length;

  const handleSave = () => {
    const updated = { ...user, name: name.trim(), bio: bio.trim() };
    saveUser(updated);
    refresh();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>

        {/* Profile card */}
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/30 via-accent/20 to-secondary/20" />
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-primary/30 border-4 border-card">
                {user.name[0].toUpperCase()}
              </div>
              <button
                data-testid="button-edit-profile"
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                  <input
                    data-testid="input-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                  <textarea
                    data-testid="textarea-bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    data-testid="button-save-profile"
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold rounded-xl"
                  >
                    <Check className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={() => { setEditing(false); setName(user.name); setBio(user.bio ?? ''); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-xl"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-extrabold text-foreground">{user.name}</h2>
                <div className="flex items-center gap-1.5 mt-1 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    user.role === 'instructor' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                  }`}>
                    {user.role}
                  </span>
                </div>
                {user.bio && <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>}
                {saved && <p className="text-xs text-green-400 mt-2">Profile saved!</p>}
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-foreground">Account Information</h3>
          {[
            { icon: User, label: 'Full Name', value: user.name },
            { icon: Mail, label: 'Email', value: user.email },
            { icon: Calendar, label: 'Member Since', value: new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-sm text-foreground font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: BookOpen, label: 'Enrolled', value: enrollments.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Award, label: 'Completed', value: completed, color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: User, label: 'In Progress', value: enrollments.filter(e => e.status === 'in-progress').length, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-card-border rounded-2xl p-4 text-center">
              <div className={`w-10 h-10 mx-auto rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-xl font-extrabold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
