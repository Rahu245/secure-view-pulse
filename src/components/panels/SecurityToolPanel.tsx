import type { SecurityTool } from "@/data/securityTools";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldOff, Play, BookOpen, Settings2 } from "lucide-react";

interface SecurityToolPanelProps {
  tool: SecurityTool;
}

const SecurityToolPanel = ({ tool }: SecurityToolPanelProps) => {
  const isReady = tool.status === "ready";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">{tool.name}</h3>
        <Badge
          variant={isReady ? "default" : "outline"}
          className={`text-[10px] ${isReady ? "" : "border-destructive/50 text-destructive"}`}
        >
          {isReady ? (
            <><ShieldCheck className="w-3 h-3 mr-1" /> Ready</>
          ) : (
            <><ShieldOff className="w-3 h-3 mr-1" /> Not Connected</>
          )}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>

      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        Category: {tool.category}
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Key Features
        </span>
        <ul className="space-y-1">
          {tool.features.map((f) => (
            <li
              key={f}
              className="text-xs text-foreground/80 flex items-center gap-2"
            >
              <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1.5 pt-2">
        <button className="cyber-btn text-[10px] px-3 py-1.5 flex items-center gap-1.5 w-full justify-center">
          <Play className="w-3 h-3" /> Run Scan
        </button>
        <button className="cyber-btn text-[10px] px-3 py-1.5 flex items-center gap-1.5 w-full justify-center">
          <BookOpen className="w-3 h-3" /> View Docs
        </button>
        <button className="cyber-btn text-[10px] px-3 py-1.5 flex items-center gap-1.5 w-full justify-center">
          <Settings2 className="w-3 h-3" /> Configure
        </button>
      </div>
    </div>
  );
};

export default SecurityToolPanel;
