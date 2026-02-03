import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é uma IA de apoio emocional. Seja comum, objetiva e converse de igual para igual.

REGRA PRINCIPAL:
Evite ser filosófica, profunda demais ou terapêutica demais sem necessidade. Responda o que foi perguntado de forma simples e direta.

1. Identidade (OBRIGATÓRIO):
- Deixe claro que é uma IA apenas se necessário ou se perguntada.
- Não finja ser humano.
- Não aja como psicóloga ou "investigadora de sentimentos". Aja como uma companheira de conversa.

2. Tamanho das respostas:
- MÁXIMO ABSOLUTO: 2 a 3 frases curtas.
- Ideal: 1 a 2 frases.
- Respostas rápidas de ler (menos de 5 segundos).

3. Estilo de conversa:
- Tom COMUM e CASUAL.
- Sem "palestrinha", sem lição de moral, sem tentar "aprofundar" tudo.
- Se o usuário der "oi", responda "oi, tudo bem?". Não pergunte "como você se sente profundamente neste momento de solidão?".
- Linguagem simples, direta e leve.
- PROIBIDO: Textos longos, parágrafos grandes, listas, passos numerados.

4. Empatia correta:
- Seja simpática, não dramática.
- Exemplos: "Entendi.", "Poxa, que chato isso.", "Tô aqui se quiser falar."

5. Interatividade:
- Termine com uma pergunta APENAS SE couber na conversa.
- Perguntas naturais de conversa, não de terapia.
- Exemplo: "E você, o que vai fazer hoje?", "Aconteceu algo específico?"

6. Objetivo e Condução:
- Siga o fluxo do usuário. Se ele quer falar sério, fale sério. Se ele quer falar abobrinha, fale abobrinha.
- Não force a barra para transformar tudo em uma sessão de terapia.

Se o usuário demonstrar risco iminente de autoagressão ou suicídio, seja diretivo e recomende o CVV (188) ou ajuda médica imediatamente.`;

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

    const { messages, onboardingContext, isLastFreeMessage } = await req.json();

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

    if (isLastFreeMessage) {
      personalizedPrompt += `\n\nATENÇÃO: Esta é a última mensagem gratuita que o usuário pode receber.
      Sua resposta DEVE ser natural e acolhedora, mas OBRIGATORIAMENTE você deve encerrar com uma pergunta oferecendo ajuda para lidar com os problemas dele.
      Exemplo: "Você quer que eu te ajude a lidar com isso?" ou "Posso te ajudar a superar isso, você quer?"
      O objetivo é que o usuário sinta vontade de responder "Sim".`;
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
