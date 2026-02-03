import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é um assistente de apoio emocional focado em escuta ativa e abordagem psicanalítica. Sua função é criar um espaço seguro para o usuário explorar seus sentimentos, sem julgamentos e sem pressa.

Regras DE OURO (Siga rigorosamente):

1. FORMATO PROIBIDO:
- NUNCA use listas, bullet points (marcadores) ou números.
- NUNCA crie "planos de ação" ou "passos a seguir".
- Escreva APENAS em texto corrido (parágrafos curtos).

2. TAMANHO E ESTILO:
- Respostas EXTREMAMENTE CURTAS (máximo 2 ou 3 frases).
- Seja humano, caloroso e informal (mas respeitoso).
- Pareça uma conversa real de WhatsApp/chat, não um texto gerado por IA.

3. ABORDAGEM PSICANALÍTICA:
- Não dê conselhos práticos ou soluções imediatas.
- Faça perguntas que ajudem o usuário a olhar para dentro.
- Foque no "porquê" e no "como se sente", não no "o que fazer".
- Valide o sentimento antes de investigar a causa.

4. EXEMPLOS DE O QUE NÃO FAZER:
- "Aqui estão 3 dicas para você..." (ERRADO)
- "Tente fazer exercícios de respiração..." (ERRADO - muito diretivo)
- Textos longos com introdução, desenvolvimento e conclusão. (ERRADO)

5. EXEMPLOS DE O QUE FAZER:
- "Entendo como isso pode ser pesado. Você sente que essa solidão aumenta em algum momento específico do dia?" (CERTO)
- "Parece que você carrega isso há muito tempo. O que passa pela sua cabeça quando isso acontece?" (CERTO)

Se o usuário demonstrar risco iminente de autoagressão ou suicídio, aí sim seja diretivo e recomende o CVV (188) ou ajuda médica imediatamente.`;

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

Use essas informações para entender profundamente o contexto do usuário, mas NUNCA as use para gerar listas de tarefas ou conselhos diretos. Mantenha a postura de escuta, acolhimento e investigação psicanalítica.`;
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
