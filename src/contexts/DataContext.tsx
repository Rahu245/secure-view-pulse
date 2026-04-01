import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ThreatData } from "@/data/mockThreats";

interface DataContextType {
  dataLoaded: boolean;
  setDataLoaded: (loaded: boolean) => void;
  threats: ThreatData[];
  setThreats: React.Dispatch<React.SetStateAction<ThreatData[]>>;
  alertsEnabled: boolean;
  setAlertsEnabled: (enabled: boolean) => void;
  autoBlockCritical: boolean;
  setAutoBlockCritical: (enabled: boolean) => void;
  blockedIps: string[];
  addBlockedIp: (ip: string) => void;
}

const DataContext = createContext<DataContextType>({
  dataLoaded: false,
  setDataLoaded: () => {},
  threats: [],
  setThreats: () => {},
  alertsEnabled: true,
  setAlertsEnabled: () => {},
  autoBlockCritical: false,
  setAutoBlockCritical: () => {},
  blockedIps: [],
  addBlockedIp: () => {},
});

export const useData = () => useContext(DataContext);

function loadBlockedIps(): string[] {
  try {
    const stored = sessionStorage.getItem("blockedIps");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [dataLoaded, setDataLoaded] = useState(() => localStorage.getItem("dataLoaded") === "true");
  const [threats, setThreats] = useState<ThreatData[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoBlockCritical, setAutoBlockCritical] = useState(() => sessionStorage.getItem("autoBlockCritical") === "true");
  const [blockedIps, setBlockedIps] = useState<string[]>(loadBlockedIps);

  const handleSetDataLoaded = (loaded: boolean) => {
    setDataLoaded(loaded);
    localStorage.setItem("dataLoaded", String(loaded));
  };

  const handleSetAutoBlock = (enabled: boolean) => {
    setAutoBlockCritical(enabled);
    sessionStorage.setItem("autoBlockCritical", String(enabled));
  };

  const addBlockedIp = useCallback((ip: string) => {
    setBlockedIps(prev => {
      if (prev.includes(ip)) return prev;
      const next = [...prev, ip];
      sessionStorage.setItem("blockedIps", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <DataContext.Provider value={{
      dataLoaded,
      setDataLoaded: handleSetDataLoaded,
      threats,
      setThreats,
      alertsEnabled,
      setAlertsEnabled,
      autoBlockCritical,
      setAutoBlockCritical: handleSetAutoBlock,
      blockedIps,
      addBlockedIp,
    }}>
      {children}
    </DataContext.Provider>
  );
};
