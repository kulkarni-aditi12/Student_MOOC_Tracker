import { useState } from 'react';
import { Bell, Shield, Palette, ChevronRight, Check } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-border'}`}
    >
      <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${value ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>

        {/* Notifications */}
        <div className="bg-card border border-card-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-4.5 h-4.5 text-primary" />
            <h2 className="font-bold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Push Notifications', desc: 'Get notified about course updates and progress reminders', value: notifications, onChange: setNotifications },
              { label: 'Email Updates', desc: 'Receive weekly learning summaries and course recommendations', value: emailUpdates, onChange: setEmailUpdates },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card border border-card-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="w-4.5 h-4.5 text-primary" />
            <h2 className="font-bold text-foreground">Appearance</h2>
          </div>
          <div className="text-sm text-muted-foreground p-4 rounded-xl bg-muted text-center">
            The app uses a beautiful dark theme designed for focused learning.
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-card border border-card-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4.5 h-4.5 text-primary" />
            <h2 className="font-bold text-foreground">Privacy & Data</h2>
          </div>
          <div className="space-y-2">
            {['Download my data', 'Delete account', 'Privacy policy'].map(item => (
              <button key={item} className="w-full flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted transition-colors text-sm text-foreground">
                {item} <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        <button
          data-testid="button-save-settings"
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25'
          }`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Settings'}
        </button>
      </div>
    </AppLayout>
  );
}
