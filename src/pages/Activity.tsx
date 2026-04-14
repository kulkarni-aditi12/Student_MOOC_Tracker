import { useMemo } from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserActivity } from '../lib/storage';
import AppLayout from '../components/layout/AppLayout';

const ACTIVITY_ICONS: Record<string, string> = {
  enrolled: '📝',
  completed: '🏆',
  progress: '⚡',
  bookmarked: '🔖',
  note: '📓',
};

const ACTIVITY_COLORS: Record<string, string> = {
  enrolled: 'bg-blue-500/10 border-blue-500/20',
  completed: 'bg-green-500/10 border-green-500/20',
  progress: 'bg-purple-500/10 border-purple-500/20',
  bookmarked: 'bg-orange-500/10 border-orange-500/20',
  note: 'bg-cyan-500/10 border-cyan-500/20',
};

function formatTime(ts: string): string {
  const date = new Date(ts);
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(diff / 86400000);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Activity() {
  const { user } = useAuth();
  const activities = useMemo(() => user ? getUserActivity(user.id) : [], [user]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof activities> = {};
    activities.forEach(a => {
      const dateStr = new Date(a.timestamp).toDateString();
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(a);
    });
    return Object.entries(groups);
  }, [activities]);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">Your learning history and activity</p>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ActivityIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <h3 className="font-semibold text-foreground mb-1">No activity yet</h3>
            <p className="text-sm">Start learning to see your activity here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([dateStr, items]) => (
              <div key={dateStr}>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {new Date(dateStr).toDateString() === new Date().toDateString() ? 'Today' : dateStr}
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-3">
                    {items.map(activity => (
                      <div key={activity.id} className="relative">
                        <div className="absolute -left-6 top-3 w-4 h-4 rounded-full bg-muted border-2 border-border flex items-center justify-center text-[10px]">
                          {ACTIVITY_ICONS[activity.type] ?? '📌'}
                        </div>
                        <div className={`ml-2 p-3.5 rounded-xl border ${ACTIVITY_COLORS[activity.type] ?? 'bg-muted border-border'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground font-medium">{activity.message}</p>
                              <p className="text-xs text-muted-foreground mt-1 truncate">{activity.courseTitle}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0 whitespace-nowrap">
                              {formatTime(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
