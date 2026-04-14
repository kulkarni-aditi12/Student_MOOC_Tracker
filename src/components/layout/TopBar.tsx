import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function TopBar() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  if (!user) return null;

  const now = new Date();
  const timeStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1 flex items-center gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-testid="input-search-topbar"
            type="text"
            placeholder="Search courses..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="text-xs text-muted-foreground hidden sm:block">{timeStr}</div>

      {/* Theme toggle */}
      <button
        data-testid="button-theme-toggle"
        onClick={toggle}
        aria-label="Toggle theme"
        className="relative w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
      >
        {theme === 'dark'
          ? <Sun className="w-4 h-4 text-yellow-400" />
          : <Moon className="w-4 h-4 text-muted-foreground" />
        }
      </button>

      <button
        data-testid="button-notifications"
        className="relative w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
      >
        <Bell className="w-4 h-4 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
      </button>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white shadow-sm">
          {user.name[0].toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-semibold text-foreground">{user.name}</div>
          <div className="text-[10px] text-muted-foreground capitalize">{user.role}</div>
        </div>
      </div>
    </header>
  );
}
