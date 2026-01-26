import { useState, useCallback } from "react";
import type { Message } from "@/components/chat/ChatMessage";

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `Olá! 👋 Sou seu assistente pessoal e estou aqui para te ajudar, sem julgamentos.

Sei que dar esse primeiro passo não é fácil, e admiro sua coragem. Estou aqui para te ouvir, apoiar e ajudar a construir hábitos mais saudáveis.

Como você está se sentindo hoje?`,
  timestamp: new Date(),
};

const AI_RESPONSES: Record<string, string> = {
  tentação: `Entendo que está passando por um momento difícil. Respira fundo. 🧘

Algumas técnicas que podem ajudar agora:

1. **Saia do ambiente** - Mude de lugar, vá para onde há outras pessoas
2. **Beba água fria** - Ajuda a "acordar" o corpo
3. **Faça 20 flexões** - Redireciona a energia
4. **Me conte mais** - Às vezes só falar ajuda

Lembre-se: esse momento vai passar. Você já mostrou força só por estar aqui. O que acha de tentar uma dessas técnicas?`,

  desabafar: `Estou aqui para te ouvir, sem julgamentos. 💚

Pode falar o que quiser - sobre como se sente, o que te levou a procurar ajuda, suas preocupações... Tudo que disser aqui fica entre nós.

Às vezes só colocar em palavras já alivia um pouco. Pode começar por onde quiser.`,

  progresso: `Que ótimo que quer registrar seu progresso! 🎯

Me conta: como foi seu dia hoje? 

- Teve algum momento de tentação?
- O que fez para se manter firme?
- Como está seu humor geral?

Cada dia conta, e celebrar as pequenas vitórias é muito importante nessa jornada.`,

  dicas: `Aqui estão algumas dicas práticas baseadas em ciência comportamental: 📚

**Prevenção:**
- Instale bloqueadores de conteúdo no celular e computador
- Evite ficar sozinho sem atividade, especialmente à noite
- Identifique seus "gatilhos" (stress, tédio, solidão)

**Substituição:**
- Quando sentir vontade, faça exercício físico
- Ligue para alguém (não precisa falar do assunto)
- Tome um banho frio

**Mindset:**
- Não se culpe por recaídas - aprenda com elas
- Foque em "um dia de cada vez"
- Celebre cada pequena vitória

Quer que eu elabore alguma dessas dicas?`,

  default: `Obrigado por compartilhar. 💚

Estou aqui para te ajudar da melhor forma possível. Você pode me contar mais sobre:

- Como está se sentindo agora
- Há quanto tempo está lutando contra isso
- O que já tentou antes
- Quais são seus maiores desafios

Quanto mais você compartilhar, melhor posso te ajudar. Não há pressa.`,
};

function getAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("tentação") || lowerMessage.includes("vontade forte")) {
    return AI_RESPONSES.tentação;
  }
  if (lowerMessage.includes("desabafar") || lowerMessage.includes("sentindo")) {
    return AI_RESPONSES.desabafar;
  }
  if (lowerMessage.includes("progresso") || lowerMessage.includes("registrar")) {
    return AI_RESPONSES.progresso;
  }
  if (lowerMessage.includes("dicas") || lowerMessage.includes("evitar")) {
    return AI_RESPONSES.dicas;
  }

  return AI_RESPONSES.default;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: getAIResponse(content),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
  };
}
