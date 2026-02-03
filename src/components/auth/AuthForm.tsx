import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons/Logo";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<{ data?: any; error: Error | null }>;
  onSignUp: (email: string, password: string) => Promise<{ data?: any; error: Error | null }>;
  onBack: () => void;
}

export function AuthForm({ onSignIn, onSignUp, onBack }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = isSignUp
        ? await onSignUp(email, password)
        : await onSignIn(email, password);

      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      } else if (isSignUp) {
        if (data?.session) {
          toast({
            title: "Conta criada!",
            description: "Bem-vindo(a)!",
          });
        } else {
          toast({
            title: "Conta criada!",
            description: "Verifique seu email para confirmar a conta.",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold">
            {isSignUp ? "Criar conta" : "Entrar"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp
              ? "Crie sua conta para começar sua jornada"
              : "Entre para continuar sua jornada"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-xl"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : isSignUp ? "Criar conta" : "Entrar"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp
              ? "Já tem conta? Entrar"
              : "Não tem conta? Criar conta"}
          </button>

          <div>
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-muted-foreground hover:underline"
            >
              Voltar para o início
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Seus dados são privados e protegidos. Não compartilhamos suas
          informações.
        </p>
      </div>
    </div>
  );
}
