import { useState, useEffect } from "react";
import { Brain, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockThreats, generateThreat } from "@/data/mockThreats";
import { streamAI } from "@/lib/streamAI";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const AiThreatSummary = () => {
  const navigate = useNavigate();
  const [threats] = useState(() => {
    const t = [...mockThreats];
    for (let i = 0; i < 20; i++) t.unshift(generateThreat());
    return t;
  });
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setSummary("");
    let accumulated = "";

    try {
      await streamAI({
        threats,
        type: "summary",
        onDelta: (chunk) => {
          accumulated += chunk;
          setSummary(accumulated);
        },
        onDone: () => setLoading(false),
        onError: (err) => {
          toast.error(err);
          setLoading(false);
        },
      });
    } catch {
      toast.error("Failed to connect to AI service");
      setLoading(false);
    }
  };

  useEffect(() => { analyze(); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 gap-4 sticky top-0 z-50">
        <button onClick={() => navigate("/")} className="cyber-btn text-xs px-3 py-1.5">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <Brain className="w-5 h-5 text-primary cyber-glow-text" />
        <h1 className="text-base font-bold text-foreground">
          AI Threat <span className="text-primary">Summary</span>
        </h1>
        <button onClick={analyze} disabled={loading} className="cyber-btn text-xs px-3 py-1.5 ml-auto">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> {loading ? "Analyzing..." : "Re-analyze"}
        </button>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="cyber-card p-6">
          {!summary && loading && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm">AI is analyzing {threats.length} threats...</span>
            </div>
          )}
          {summary && (
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:text-foreground prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-headings:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-strong:text-primary
              prose-li:text-muted-foreground
              prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-ul:space-y-1 prose-ol:space-y-1">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          )}
          {!summary && !loading && (
            <p className="text-muted-foreground text-sm text-center py-12">Click "Re-analyze" to generate a threat summary.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AiThreatSummary;
