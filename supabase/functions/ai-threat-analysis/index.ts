import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { threats, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    if (type === "summary") {
      systemPrompt = `You are a cybersecurity threat intelligence analyst. Analyze the provided threat data and generate a concise executive summary. Include:
1. Overall threat landscape assessment
2. Most prevalent attack types and their frequency
3. Top attacking countries and target countries
4. Severity distribution analysis
5. Key patterns and trends observed
6. Critical threats requiring immediate attention
Format with clear headers using markdown. Be specific with numbers and percentages.`;
    } else if (type === "recommendations") {
      systemPrompt = `You are a cybersecurity defense specialist. Based on the provided threat data, generate:
1. **Suggested Fixes**: Specific, actionable remediation steps for the detected threats. Include firewall rules, patches, and configuration changes.
2. **Risk Reduction Tips**: Proactive measures to reduce the attack surface. Include network segmentation, monitoring, and incident response recommendations.
3. **Priority Actions**: Rank the top 5 most urgent actions based on threat severity and frequency.
4. **Defense Score**: Rate the current defense posture on a scale of 1-10 based on the threats detected.
Format with clear headers using markdown. Be specific and actionable.`;
    }

    const threatSummary = threats.slice(0, 30).map((t: any) => ({
      attackType: t.attackType,
      severity: t.severity,
      country: t.country,
      targetCountry: t.targetCountry,
      device: t.device,
      port: t.port,
    }));

    const payload = JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Analyze this threat intelligence data (${threats.length} total threats, showing sample of ${threatSummary.length}):\n\n${JSON.stringify(threatSummary, null, 2)}`,
        },
      ],
      stream: true,
    });

    let response: Response | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: payload,
      });
      if (response.ok || (response.status !== 502 && response.status !== 503)) break;
      console.warn(`AI gateway returned ${response.status}, retrying...`);
      await response.text(); // consume body
      await new Promise(r => setTimeout(r, 2000));
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-threat-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
