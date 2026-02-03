import { Lock, Eye, Server, Shield } from "lucide-react";

const privacyPoints = [
  {
    icon: Lock,
    title: "Conversas criptografadas",
    description: "Suas mensagens são protegidas com criptografia de ponta.",
  },
  {
    icon: Eye,
    title: "Sem exposição",
    description: "Ninguém além de você terá acesso às suas conversas.",
  },
  {
    icon: Server,
    title: "Dados seguros",
    description: "Seus dados não são vendidos ou compartilhados.",
  },
  {
    icon: Shield,
    title: "Anonimato",
    description: "Você não precisa fornecer informações pessoais.",
  },
];

export function Privacy() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Sua privacidade é sagrada
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Um espaço seguro para sua jornada
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sua jornada é privada. Seus dados não são compartilhados. Você está em
            um espaço seguro.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyPoints.map((point, index) => (
            <div
              key={point.title}
              className="glass-card p-6 rounded-2xl text-center hover:bg-white/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                <point.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
