import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { typology, location, price, highlights } = await req.json();

    if (!typology || !location || !price) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios em falta." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `És um copywriter profissional especializado em imobiliário de luxo em Portugal. Escreves SEMPRE em Português de Portugal (PT-PT). O teu estilo é emocional, sofisticado e persuasivo — inspiras desejo e urgência sem ser agressivo.

Recebes dados sobre um imóvel e deves gerar EXATAMENTE este JSON (sem markdown, sem explicações, apenas JSON puro):

{
  "description": "Texto descritivo emocional de 3-4 parágrafos para portais como Idealista/CasaSapo. Deve começar com uma frase impactante, descrever os pontos fortes e terminar com um call-to-action.",
  "captions": [
    "Legenda 1 para Instagram/TikTok com emojis e 5-8 hashtags relevantes",
    "Legenda 2 para Instagram/TikTok com emojis e 5-8 hashtags relevantes",
    "Legenda 3 para Instagram/TikTok com emojis e 5-8 hashtags relevantes"
  ],
  "script": "Guião de vídeo de 30 segundos para Reels, dividido em secções temporais [0-5s], [5-15s], [15-25s], [25-30s] com indicações de planos visuais, texto em ecrã e voz off."
}`;

    const userPrompt = `Dados do imóvel:
- Tipologia: ${typology}
- Localização: ${location}
- Preço: ${price}
- Pontos fortes: ${highlights || "Não especificados"}

Gera o conteúdo de marketing completo em JSON.`;

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
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_property_content",
              description: "Generate marketing content for a real estate property",
              parameters: {
                type: "object",
                properties: {
                  description: {
                    type: "string",
                    description: "Emotional descriptive text for property portals (3-4 paragraphs in PT-PT)",
                  },
                  captions: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 creative captions for Instagram/TikTok with emojis and hashtags",
                  },
                  script: {
                    type: "string",
                    description: "30-second video script for Reels with time sections",
                  },
                },
                required: ["description", "captions", "script"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_property_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de pedidos excedido. Tente novamente em breve." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA insuficientes. Adicione créditos nas definições." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao gerar conteúdo." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("Unexpected AI response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Resposta inesperada da IA." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const content = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-property-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
