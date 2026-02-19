import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import GeoMap from "@/components/GeoMap";
import ThreatTable from "@/components/ThreatTable";
import StatsBar from "@/components/StatsBar";
import AlertSystem from "@/components/AlertSystem";
import StaticUploadPanel from "@/components/panels/StaticUploadPanel";
import LiveApiPanel from "@/components/panels/LiveApiPanel";
import ImageScannerPanel from "@/components/panels/ImageScannerPanel";
import BarcodeScannerPanel from "@/components/panels/BarcodeScannerPanel";
import StatsPanel from "@/components/panels/StatsPanel";
import SettingsPanel from "@/components/panels/SettingsPanel";
import { mockThreats, generateThreat } from "@/data/mockThreats";
import type { ThreatData } from "@/data/mockThreats";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [threats, setThreats] = useState<ThreatData[]>(mockThreats);
  const [activeTab, setActiveTab] = useState("Overview");
  const [activePanel, setActivePanel] = useState("");
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
    'image-scan': <ImageScannerPanel />,
    barcode: <BarcodeScannerPanel />,
    stats: <StatsPanel threats={threats} />,
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
          <StatsBar threats={threats} />
          <GeoMap threats={threats} />
          <ThreatTable threats={threats} />
        </main>
      </div>

      <AlertSystem threats={threats} />
    </div>
  );
};

export default Index;
