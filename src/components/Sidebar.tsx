import { Upload, Radio, Globe, ScanLine, QrCode, BarChart3, Settings, Key, Brain, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const panelItems = [
  { id: 'upload', label: 'Static Data', icon: Upload },
  { id: 'api', label: 'Live API', icon: Radio },
  { id: 'rest-api', label: 'REST API', icon: Globe },
  { id: 'image-scan', label: 'Image Scan', icon: ScanLine },
  { id: 'barcode', label: 'Barcode', icon: QrCode },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const pageItems = [
  { label: 'API Keys', icon: Key, path: '/api-keys' },
  { label: 'AI Summary', icon: Brain, path: '/ai-summary' },
  { label: 'AI Recs', icon: ShieldCheck, path: '/ai-recommendations' },
];

const Sidebar = ({ activePanel, onPanelChange }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-[72px] border-r border-border bg-card/60 backdrop-blur-md flex flex-col items-center py-3 gap-1">
      {panelItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPanelChange(activePanel === item.id ? '' : item.id)}
          className={`cyber-sidebar-btn ${activePanel === item.id ? 'active' : ''}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{item.label}</span>
        </button>
      ))}

      <div className="w-10 h-px bg-border my-1" />

      {pageItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`cyber-sidebar-btn ${location.pathname === item.path ? 'active' : ''}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
