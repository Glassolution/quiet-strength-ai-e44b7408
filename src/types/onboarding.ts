export interface OnboardingAnswers {
  frequency_impact: string | null;
  main_triggers: string[];
  main_triggers_other: string | null;
  high_risk_times: string[];
  previous_attempts: string[];
  previous_attempts_other: string | null;
  primary_goal: string | null;
  consent_privacy: string | null;
}

export interface OnboardingQuestion {
  key: keyof OnboardingAnswers;
  question: string;
  inputType: "single_choice" | "multi_choice";
  options: string[];
  hasOtherText?: boolean;
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    key: "frequency_impact",
    question: "Com que frequência isso tem atrapalhado sua vida recentemente?",
    inputType: "single_choice",
    options: ["Quase todo dia", "Algumas vezes por semana", "Raramente", "Prefiro não dizer"],
  },
  {
    key: "main_triggers",
    question: "Quais gatilhos mais te levam a isso? (pode marcar mais de um)",
    inputType: "multi_choice",
    options: [
      "Estresse/ansiedade",
      "Tédio",
      "Solidão",
      "Madrugada/insônia",
      "Redes sociais",
      "Problemas no relacionamento",
      "Outro",
    ],
    hasOtherText: true,
  },
  {
    key: "high_risk_times",
    question: "Em quais horários você costuma ter mais dificuldade?",
    inputType: "multi_choice",
    options: ["Manhã", "Tarde", "Noite", "Madrugada", "Varia muito"],
  },
  {
    key: "previous_attempts",
    question: "O que você já tentou antes?",
    inputType: "multi_choice",
    options: ["Bloqueadores", "Força de vontade", "Terapia", "Rotina/academia", "Nada ainda", "Outro"],
    hasOtherText: true,
  },
  {
    key: "primary_goal",
    question: "Qual é seu objetivo agora?",
    inputType: "single_choice",
    options: ["Parar", "Reduzir bastante", "Retomar foco/rotina", "Entender gatilhos", "Prefiro não dizer"],
  },
  {
    key: "consent_privacy",
    question: "Posso usar suas respostas para personalizar as orientações aqui no chat? (Sem vender dados.)",
    inputType: "single_choice",
    options: ["Sim", "Não"],
  },
];
