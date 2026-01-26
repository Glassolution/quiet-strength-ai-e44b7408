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
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          Como posso te ajudar
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          Um assistente pessoal que entende sua jornada e oferece suporte
          prático e empático.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card border border-border/50 rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300 fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
