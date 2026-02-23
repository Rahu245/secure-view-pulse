import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import GeoMap from "@/components/GeoMap";
import ThreatTable from "@/components/ThreatTable";
import AttackHistory from "@/components/AttackHistory";
import StatsBar from "@/components/StatsBar";
import AlertSystem from "@/components/AlertSystem";
import StaticUploadPanel from "@/components/panels/StaticUploadPanel";
import LiveApiPanel from "@/components/panels/LiveApiPanel";
import RestApiPanel from "@/components/panels/RestApiPanel";
import ImageScannerPanel from "@/components/panels/ImageScannerPanel";
import BarcodeScannerPanel from "@/components/panels/BarcodeScannerPanel";
import StatsPanel from "@/components/panels/StatsPanel";
import SettingsPanel from "@/components/panels/SettingsPanel";
import { mockThreats, generateThreat, COUNTRIES } from "@/data/mockThreats";
import type { ThreatData } from "@/data/mockThreats";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Globe } from "lucide-react";

const Index = () => {
  const [threats, setThreats] = useState<ThreatData[]>(mockThreats);
  const [activeTab, setActiveTab] = useState("Overview");
  const [activePanel, setActivePanel] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Simulate live incoming threats
  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => {
        const newThreat = generateThreat();
        return [newThreat, ...prev.slice(0, 99)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredThreats = useMemo(() => {
    if (selectedCountry === "all") return threats;
    return threats.filter(t => t.country === selectedCountry || t.targetCountry === selectedCountry);
  }, [threats, selectedCountry]);

  const handleTabChange = (tab: string) => {
    if (tab === 'Analytics') {
      navigate('/analytics');
    } else {
      setActiveTab(tab);
    }
  };

  const panelComponents: Record<string, React.ReactNode> = {
    upload: <StaticUploadPanel onDataLoaded={() => {}} />,
    api: <LiveApiPanel />,
    'rest-api': <RestApiPanel />,
    'image-scan': <ImageScannerPanel />,
    barcode: <BarcodeScannerPanel />,
    stats: <StatsPanel threats={filteredThreats} />,
    settings: <SettingsPanel />,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex flex-1">
        <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />

        {/* Side Panel */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="border-r border-border bg-card/40 backdrop-blur-md overflow-hidden"
            >
              <div className="w-[280px] p-4 h-full overflow-y-auto scrollbar-cyber">
                {panelComponents[activePanel]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-cyber">
          {/* Country Filter Bar */}
          <div className="flex items-center justify-between">
            <StatsBar threats={filteredThreats} />
          </div>

          {/* Country Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="cyber-btn text-xs px-3 py-1.5 flex items-center gap-2"
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>{selectedCountry === "all" ? "All Countries" : selectedCountry}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${countryDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {countryDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-50 w-52 rounded-lg border border-border bg-popover shadow-xl">
                  <div className="p-1 max-h-64 overflow-y-auto scrollbar-cyber">
                    <button
                      onClick={() => { setSelectedCountry("all"); setCountryDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors ${
                        selectedCountry === "all" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>All Countries</span>
                      {selectedCountry === "all" && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                    {COUNTRIES.map((country) => {
                      const count = threats.filter(t => t.country === country || t.targetCountry === country).length;
                      return (
                        <button
                          key={country}
                          onClick={() => { setSelectedCountry(country); setCountryDropdownOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors ${
                            selectedCountry === country ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{country}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">{count}</span>
                            {selectedCountry === country && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {selectedCountry !== "all" && (
              <span className="text-[10px] text-muted-foreground">
                Showing {filteredThreats.length} of {threats.length} threats
              </span>
            )}
          </div>

          <GeoMap threats={filteredThreats} />
          <AttackHistory threats={filteredThreats} />
          <ThreatTable threats={filteredThreats} />
        </main>
      </div>

      <AlertSystem threats={filteredThreats} />
    </div>
  );
};

export default Index;
