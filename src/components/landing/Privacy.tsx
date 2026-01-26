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
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
          <Shield className="w-4 h-4" />
          Sua privacidade é sagrada
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Um espaço seguro para sua jornada
        </h2>

        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Sua jornada é privada. Seus dados não são compartilhados. Você está em
          um espaço seguro.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyPoints.map((point, index) => (
            <div
              key={point.title}
              className="p-5 rounded-xl bg-muted/50 fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <point.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-1">{point.title}</h3>
              <p className="text-sm text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
