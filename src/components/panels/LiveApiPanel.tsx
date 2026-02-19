import { useState } from "react";
import { Radio, Play, Square, RefreshCw } from "lucide-react";

const LiveApiPanel = () => {
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [interval, setInterval] = useState('5');

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Radio className="w-4 h-4 text-primary" />
        Live API Manager
      </h3>

      <div className="space-y-2">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">API Endpoint</label>
        <input
          type="url"
          placeholder="https://api.example.com/threats"
          value={endpoint}
          onChange={e => setEndpoint(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">API Key</label>
        <input
          type="password"
          placeholder="Enter API key..."
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 font-mono"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Refresh Interval</label>
        <select
          value={interval}
          onChange={e => setInterval(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/40"
        >
          <option value="1">1 second</option>
          <option value="5">5 seconds</option>
          <option value="10">10 seconds</option>
          <option value="30">30 seconds</option>
          <option value="60">1 minute</option>
        </select>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={`cyber-btn text-xs flex-1 justify-center ${isStreaming ? 'active' : ''}`}
        >
          {isStreaming ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isStreaming ? 'Stop' : 'Start'} Stream
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className={`pulse-dot ${isStreaming ? 'online' : 'offline'}`} />
        <span className="text-muted-foreground">{isStreaming ? 'Streaming live data...' : 'Disconnected'}</span>
      </div>
    </div>
  );
};

export default LiveApiPanel;
