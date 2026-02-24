import { Shield, Activity, Key, Brain, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = ['Overview', 'Analytics', 'Threat Map', 'Scanner', 'API Manager'];
const pageNavItems = [
  { label: 'API Keys', icon: Key, path: '/api-keys' },
  { label: 'AI Summary', icon: Brain, path: '/ai-summary' },
  { label: 'AI Recommendations', icon: ShieldCheck, path: '/ai-recommendations' },
];

const TopNav = ({ activeTab, onTabChange }: TopNavProps) => {
  const navigate = useNavigate();
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
        <div className="w-px h-5 bg-border mx-1" />
        {pageNavItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="cyber-btn text-xs px-3 py-1.5"
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
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
