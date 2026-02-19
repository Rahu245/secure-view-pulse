import { Upload, Radio, ScanLine, QrCode, BarChart3, Settings } from "lucide-react";

interface SidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const sidebarItems = [
  { id: 'upload', label: 'Static Data', icon: Upload },
  { id: 'api', label: 'Live API', icon: Radio },
  { id: 'image-scan', label: 'Image Scan', icon: ScanLine },
  { id: 'barcode', label: 'Barcode', icon: QrCode },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ activePanel, onPanelChange }: SidebarProps) => {
  return (
    <aside className="w-[72px] border-r border-border bg-card/60 backdrop-blur-md flex flex-col items-center py-3 gap-1">
      {sidebarItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPanelChange(activePanel === item.id ? '' : item.id)}
          className={`cyber-sidebar-btn ${activePanel === item.id ? 'active' : ''}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] leading-tight">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
