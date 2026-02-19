import { Shield, Activity } from "lucide-react";

interface TopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = ['Overview', 'Analytics', 'Threat Map', 'Scanner', 'API Manager'];

const TopNav = ({ activeTab, onTabChange }: TopNavProps) => {
  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-2 mr-6">
        <Shield className="w-6 h-6 text-primary cyber-glow-text" />
        <h1 className="text-base font-bold tracking-tight text-foreground">
          Cyber Threat <span className="text-primary">Intelligence</span>
        </h1>
      </div>

      <nav className="flex items-center gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onTabChange(item)}
            className={`cyber-btn text-xs px-3 py-1.5 ${activeTab === item ? 'active' : ''}`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">Cloud</span>
          <span className="text-cyber-green font-medium">Connected</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
          <div className="pulse-dot online" />
          <span className="text-muted-foreground">Live</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
