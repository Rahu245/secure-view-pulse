import { useState, useEffect, useRef } from "react";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { streamAI } from "@/lib/streamAI";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const AiRecommendations = () => {
  const { threats } = useData();
  const [recommendations, setRecommendations] = useState("");
  const lastAnalyzedCount = useRef(0);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setRecommendations("");
    let accumulated = "";

    try {
      await streamAI({
        threats,
        type: "recommendations",
        onDelta: (chunk) => {
          accumulated += chunk;
          setRecommendations(accumulated);
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

  useEffect(() => {
    if (threats.length > 0 && threats.length !== lastAnalyzedCount.current) {
      lastAnalyzedCount.current = threats.length;
      analyze();
    }
  }, [threats.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (threats.length > 0 && threats.length !== lastAnalyzedCount.current && !loading) {
        lastAnalyzedCount.current = threats.length;
        analyze();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [threats.length, loading]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          AI <span className="text-primary">Recommendations</span>
        </h1>
        <button onClick={analyze} disabled={loading} className="cyber-btn text-xs px-3 py-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> {loading ? "Analyzing..." : "Re-analyze"}
        </button>
      </div>

      <div className="cyber-card p-6">
        {!recommendations && loading && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm">AI is generating recommendations for {threats.length} threats...</span>
          </div>
        )}
        {recommendations && (
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-foreground prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-headings:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-primary
            prose-li:text-muted-foreground
            prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-ul:space-y-1 prose-ol:space-y-1">
            <ReactMarkdown>{recommendations}</ReactMarkdown>
          </div>
        )}
        {!recommendations && !loading && (
          <p className="text-muted-foreground text-sm text-center py-12">Click "Re-analyze" to generate recommendations.</p>
        )}
      </div>
    </div>
  );
};

export default AiRecommendations;
