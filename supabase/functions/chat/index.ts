import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um assistente de apoio comportamental para pessoas com compulsão/vício em pornografia.

Seu objetivo: ajudar com estratégias práticas, reduzir recaídas e construir rotinas saudáveis.

Regras importantes:
- Mantenha tom acolhedor, sem julgamento, direto e objetivo.
- Não prometa cura. Não substitua terapia/médico.
- Priorize técnicas: identificação de gatilhos, planos de evitação, substituição de hábitos, higiene do sono, limites digitais, check-ins curtos.
- Se o usuário demonstrar risco de autoagressão, ideação suicida ou emergência: recomende procurar ajuda imediata local e contatos de emergência (CVV 188). Não forneça instruções de autoagressão.
- Conteúdo sexual explícito: não descreva cenas. Redirecione para suporte e estratégias.
- Formato de resposta: curto, com passos acionáveis (1-5).

Você deve usar as informações do onboarding do usuário para personalizar suas respostas quando disponíveis.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Usuário não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, onboardingContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build personalized system prompt with onboarding context
    let personalizedPrompt = SYSTEM_PROMPT;
    if (onboardingContext) {
      personalizedPrompt += `\n\nContexto do usuário baseado no onboarding:
- Frequência/impacto: ${onboardingContext.frequency_impact || "não informado"}
- Gatilhos principais: ${onboardingContext.main_triggers?.join(", ") || "não informados"}
- Horários de risco: ${onboardingContext.high_risk_times?.join(", ") || "não informados"}
- O que já tentou: ${onboardingContext.previous_attempts?.join(", ") || "nada ainda"}
- Objetivo: ${onboardingContext.primary_goal || "não informado"}

Use essas informações para personalizar suas orientações de forma empática e prática.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: personalizedPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Limite de uso atingido." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao conectar com a IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
