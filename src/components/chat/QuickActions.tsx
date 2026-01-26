import { Heart, AlertTriangle, TrendingUp, HelpCircle } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const actions = [
  {
    icon: AlertTriangle,
    label: "Estou em tentação",
    message: "Estou sentindo uma tentação forte agora. Preciso de ajuda.",
  },
  {
    icon: Heart,
    label: "Preciso desabafar",
    message: "Preciso desabafar sobre como estou me sentindo.",
  },
  {
    icon: TrendingUp,
    label: "Registrar progresso",
    message: "Quero registrar meu progresso de hoje.",
  },
  {
    icon: HelpCircle,
    label: "Dicas práticas",
    message: "Me dê dicas práticas para evitar recaídas.",
  },
];

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onActionClick(action.message)}
          className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted text-left transition-colors text-sm"
        >
          <action.icon className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-muted-foreground">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
