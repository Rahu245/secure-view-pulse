import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { ArrowLeft, Download } from "lucide-react";
import TopNav from "@/components/TopNav";
import { mockThreats, ATTACK_TYPES, COUNTRIES } from "@/data/mockThreats";

const SEVERITY_COLORS = {
  critical: 'hsl(0,72%,55%)',
  high: 'hsl(20,80%,55%)',
  medium: 'hsl(45,93%,58%)',
  low: 'hsl(142,70%,45%)',
};

const CHART_COLORS = ['hsl(185,100%,50%)', 'hsl(217,91%,60%)', 'hsl(0,72%,55%)', 'hsl(45,93%,58%)', 'hsl(142,70%,45%)', 'hsl(280,60%,55%)', 'hsl(30,80%,55%)', 'hsl(200,60%,50%)'];

const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('24h');
  const [countryFilter, setCountryFilter] = useState('all');

  const threats = mockThreats;

  // Attack type frequency
  const attackTypeData = useMemo(() => {
    return ATTACK_TYPES.map(type => ({
      name: type.length > 12 ? type.slice(0, 12) + '…' : type,
      fullName: type,
      count: threats.filter(t => t.attackType === type).length,
    })).sort((a, b) => b.count - a.count);
  }, [threats]);

  // Country distribution
  const countryData = useMemo(() => {
    const counts: Record<string, number> = {};
    threats.forEach(t => { counts[t.country] = (counts[t.country] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [threats]);

  // Trend data (simulated hourly)
  const trendData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      attacks: Math.floor(Math.random() * 20 + 5),
      critical: Math.floor(Math.random() * 5),
      blocked: Math.floor(Math.random() * 15 + 3),
    }));
  }, []);

  // Severity distribution
  const severityData = useMemo(() => {
    return [
      { name: 'Critical', value: threats.filter(t => t.severity === 'critical').length },
      { name: 'High', value: threats.filter(t => t.severity === 'high').length },
      { name: 'Medium', value: threats.filter(t => t.severity === 'medium').length },
      { name: 'Low', value: threats.filter(t => t.severity === 'low').length },
    ];
  }, [threats]);

  // Device distribution
  const deviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    threats.forEach(t => { counts[t.device] = (counts[t.device] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [threats]);

  const customTooltipStyle = {
    backgroundColor: 'hsl(222,40%,10%)',
    border: '1px solid hsl(222,30%,20%)',
    borderRadius: '8px',
    fontSize: '11px',
    color: 'hsl(200,20%,90%)',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav activeTab="Analytics" onTabChange={(tab) => {
        if (tab !== 'Analytics') navigate('/');
      }} />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-cyber">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="cyber-btn text-xs">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Threat <span className="text-primary">Analytics</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/40"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/40"
            >
              <option value="all">All Countries</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="cyber-btn text-xs">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Attack Types Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="cyber-card p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Attack Type Frequency</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attackTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="hsl(185,100%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Country Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="cyber-card p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Country Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={countryData} cx="50%" cy="50%" outerRadius={85} innerRadius={40} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {countryData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Attack Trends Line Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="cyber-card p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Attack Trends Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Line type="monotone" dataKey="attacks" stroke="hsl(185,100%,50%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="critical" stroke="hsl(0,72%,55%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="blocked" stroke="hsl(142,70%,45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Device Distribution */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="cyber-card p-4">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Device-wise Attacks</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} width={90} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="value" fill="hsl(217,91%,60%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Heatmap - Attack Intensity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="cyber-card p-4">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Severity Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,30%,18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215,20%,55%)' }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="attacks" stroke="hsl(185,100%,50%)" fill="hsl(185,100%,50%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="critical" stroke="hsl(0,72%,55%)" fill="hsl(0,72%,55%)" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;
