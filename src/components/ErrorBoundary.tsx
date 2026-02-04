import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Algo deu errado</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Ocorreu um erro inesperado ao carregar a aplicação. Tente recarregar a página.
          </p>
          <div className="bg-card p-4 rounded-md border border-border mb-6 max-w-lg overflow-auto text-left w-full">
            <p className="font-mono text-xs text-destructive">
              {this.state.error?.toString()}
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Recarregar Página
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
