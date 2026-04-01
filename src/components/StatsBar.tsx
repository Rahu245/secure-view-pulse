import { motion } from "framer-motion";
import { AlertTriangle, Shield, Activity, Globe, Ban } from "lucide-react";
import type { ThreatData } from "@/data/mockThreats";

interface StatsBarProps {
  threats: ThreatData[];
  blockedIps?: string[];
}

const StatsBar = ({ threats, blockedIps = [] }: StatsBarProps) => {
  const blockedSet = new Set(blockedIps);
  const activeThreats = threats.filter(t => !blockedSet.has(t.attackerIp));
  const criticalCount = activeThreats.filter(t => t.severity === 'critical').length;
  const highCount = activeThreats.filter(t => t.severity === 'high').length;
  const uniqueCountries = new Set(activeThreats.map(t => t.country)).size;

  const stats = [
    { label: 'Active Threats', value: activeThreats.length, icon: Activity, color: 'text-primary' },
    { label: 'Critical', value: criticalCount, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'High Risk', value: highCount, icon: Shield, color: 'text-cyber-yellow' },
    { label: 'Countries', value: uniqueCountries, icon: Globe, color: 'text-secondary' },
    ...(blockedIps.length > 0 ? [{ label: 'Blocked IPs', value: blockedIps.length, icon: Ban, color: 'text-destructive' }] : []),
  ];

  return (
    <div className={`grid gap-3 ${blockedIps.length > 0 ? 'grid-cols-5' : 'grid-cols-4'}`}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="cyber-card p-3 flex items-center gap-3"
        >
          <div className={`${stat.color} p-2 rounded-lg bg-muted`}>
            <stat.icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground font-mono">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
