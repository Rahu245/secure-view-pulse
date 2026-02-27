import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an IP Intelligence Agent for a Cyber Threat Intelligence dashboard. Your role is to analyze IP addresses and provide security intelligence.

When a user provides an IP address, you should:
1. Identify the IP type (public/private, IPv4/IPv6)
2. Provide simulated but realistic threat intelligence including:
   - Geolocation (country, city, ISP)
   - Recent attack activities (DDoS, port scanning, brute force, etc.)
   - Risk score (1-100)
   - Associated malware or botnets
   - Open ports detected
   - Historical attack frequency
3. When the user asks for analytics, graphs, or charts, use the render_chart tool to display data visually.

Be specific with data. Use realistic but simulated values. Format responses with markdown for readability.
Keep responses concise and actionable. Focus on security-relevant information.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        tools: [
          {
            type: "function",
            function: {
              name: "render_chart",
              description: "Render a chart/graph visualization. Use this when the user asks for analytics, graphs, statistics, or visual data about an IP address or threat data.",
              parameters: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["bar", "pie", "line"],
                    description: "Chart type. Use bar for comparisons, pie for distributions, line for trends over time.",
                  },
                  title: {
                    type: "string",
                    description: "Short descriptive title for the chart.",
                  },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Label for this data point" },
                        value: { type: "number", description: "Numeric value" },
                      },
                      required: ["name", "value"],
                    },
                    description: "Array of data points with name and value.",
                  },
                },
                required: ["type", "title", "data"],
              },
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
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
    console.error("ip-agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
