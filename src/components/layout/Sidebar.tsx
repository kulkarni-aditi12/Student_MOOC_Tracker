import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, BookOpen, Compass, Activity, Bookmark,
  User, Settings, GraduationCap, PlusCircle, Menu, X, LogOut, Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const studentNav = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/courses', label: 'Discover', icon: Compass },
  { to: '/my-learning', label: 'My Learning', icon: BookOpen },
  { to: '/my-courses', label: 'My Courses', icon: Target },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const instructorNav = [
  { to: '/instructor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/courses', label: 'Courses', icon: Compass },
  { to: '/manage-courses', label: 'Manage Courses', icon: PlusCircle },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const nav = user.role === 'instructor' ? instructorNav : studentNav;

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-foreground leading-tight">MOOC Tracker</div>
          <div className="text-[10px] text-muted-foreground">Learning Platform</div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => {
          const isActive = location === to;
          return (
            <Link key={to} href={to}>
              <div
                data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/15 text-primary shadow-sm shadow-primary/10'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-r-full" />
                )}
                <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
                <span className="text-sm font-medium">{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-sm font-bold text-white shadow-sm">
            {user.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{user.name}</div>
            <div className="text-[10px] text-muted-foreground capitalize">{user.role}</div>
          </div>
        </div>
        <button
          data-testid="button-logout"
          onClick={logout}
          className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors py-2 px-3 rounded-lg hover:bg-destructive/10"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        data-testid="button-mobile-menu"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-60 bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <NavContent />
      </aside>
    </>
  );
}
