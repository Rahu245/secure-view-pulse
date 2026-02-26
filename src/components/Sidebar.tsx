import { useState } from "react";
import {
  Upload, Radio, Globe, ScanLine, QrCode, BarChart3, Settings,
  Key, Brain, ShieldCheck, Radar, ChevronDown, Search,
  Shield, Bug, Globe2, MonitorCheck, HardDrive,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toolCategories } from "@/data/securityTools";

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
  { id: 'nmap', label: 'Nmap', icon: Radar },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const pageItems = [
  { label: 'API Keys', icon: Key, path: '/api-keys' },
  { label: 'AI Summary', icon: Brain, path: '/ai-summary' },
  { label: 'AI Recs', icon: ShieldCheck, path: '/ai-recommendations' },
];

const categoryIcons: Record<string, React.ElementType> = {
  "vuln-assessment": Shield,
  "pentest": Bug,
  "web-security": Globe2,
  "siem": MonitorCheck,
  "forensics": HardDrive,
};

const Sidebar = ({ activePanel, onPanelChange }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = searchQuery.trim()
    ? toolCategories
        .map((cat) => ({
          ...cat,
          tools: cat.tools.filter(
            (t) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((cat) => cat.tools.length > 0)
    : toolCategories;

  return (
    <aside className="w-[72px] hover:w-[220px] group/sidebar transition-all duration-200 border-r border-border bg-card/60 backdrop-blur-md flex flex-col py-3 gap-0.5 overflow-y-auto overflow-x-hidden scrollbar-cyber">
      {/* Core tools */}
      {panelItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPanelChange(activePanel === item.id ? '' : item.id)}
          className={`cyber-sidebar-btn flex items-center gap-2 px-2 ${activePanel === item.id ? 'active' : ''}`}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span className="text-[10px] leading-tight whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
            {item.label}
          </span>
        </button>
      ))}

      <div className="w-10 h-px bg-border my-1 mx-auto" />

      {/* Page navigation */}
      {pageItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`cyber-sidebar-btn flex items-center gap-2 px-2 ${location.pathname === item.path ? 'active' : ''}`}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span className="text-[10px] leading-tight whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
            {item.label}
          </span>
        </button>
      ))}

      <div className="w-10 h-px bg-border my-1 mx-auto" />

      {/* Search – visible on hover */}
      <div className="px-2 opacity-0 group-hover/sidebar:opacity-100 transition-opacity h-0 group-hover/sidebar:h-auto overflow-hidden">
        <div className="relative mb-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded text-[10px] py-1 pl-6 pr-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Security tool categories */}
      {filteredCategories.map((cat) => {
        const CatIcon = categoryIcons[cat.id] || Shield;
        const isExpanded = expandedCategories[cat.id] || !!searchQuery.trim();

        return (
          <div key={cat.id}>
            <button
              onClick={() => toggleCategory(cat.id)}
              className="cyber-sidebar-btn flex items-center gap-2 px-2 w-full"
            >
              <CatIcon className="w-5 h-5 shrink-0 text-primary/70" />
              <span className="text-[10px] leading-tight whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity flex-1 text-left">
                {cat.label}
              </span>
              <ChevronDown
                className={`w-3 h-3 shrink-0 text-muted-foreground transition-transform opacity-0 group-hover/sidebar:opacity-100 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="flex flex-col gap-0.5 opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
                {cat.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => onPanelChange(activePanel === tool.id ? "" : tool.id)}
                    className={`flex items-center gap-2 px-2 pl-8 py-1.5 text-[10px] rounded transition-colors whitespace-nowrap ${
                      activePanel === tool.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        tool.status === "ready" ? "bg-green-500" : "bg-muted-foreground/40"
                      }`}
                    />
                    {tool.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;
