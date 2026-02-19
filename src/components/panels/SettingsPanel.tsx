import { Settings, Bell, Shield, Database } from "lucide-react";

const SettingsPanel = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Settings className="w-4 h-4 text-primary" />
        Settings & Config
      </h3>

      <div className="space-y-2">
        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Bell className="w-4 h-4 text-primary" />
            <span>Alert Notifications</span>
          </div>
          <div className="w-8 h-4 rounded-full bg-primary/30 relative cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-primary absolute right-0 top-0" />
          </div>
        </div>

        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4 text-cyber-yellow" />
            <span>Auto-block Critical</span>
          </div>
          <div className="w-8 h-4 rounded-full bg-muted relative cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-muted-foreground absolute left-0 top-0" />
          </div>
        </div>

        <div className="cyber-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Database className="w-4 h-4 text-secondary" />
            <span>Data Retention</span>
          </div>
          <span className="text-xs text-muted-foreground">30 days</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
