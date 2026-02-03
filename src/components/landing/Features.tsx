import { MessageCircle, TrendingUp, Bell, Shield } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Conversas em tempo real",
    description:
      "Converse quando precisar. A IA está disponível 24/7 para te ouvir e apoiar.",
  },
  {
    icon: TrendingUp,
    title: "Acompanhamento de progresso",
    description:
      "Visualize sua jornada. Acompanhe dias sem recaída e celebre cada vitória.",
  },
  {
    icon: Bell,
    title: "Apoio em momentos difíceis",
    description:
      "Receba mensagens de apoio quando mais precisar. Estratégias práticas para momentos de tentação.",
  },
  {
    icon: Shield,
    title: "Privacidade absoluta",
    description:
      "Suas conversas são privadas e seguras. Nenhum dado é compartilhado.",
  },
];

export function Features() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Como posso te ajudar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Um assistente pessoal que entende sua jornada e oferece suporte
            prático e empático.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-colors duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
