import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isChunkLoadError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isChunkLoadError: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorText = error.message || "";
    const isChunkLoadError =
      error.name === "TypeError" ||
      errorText.includes("Failed to fetch") ||
      errorText.includes("dynamically imported module") ||
      errorText.includes("Loading chunk");

    return {
      hasError: true,
      error,
      isChunkLoadError,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Auto-reload once if it is a chunk load error (network blip or deployment update)
    const errorText = error.message || "";
    const isChunkLoad =
      error.name === "TypeError" ||
      errorText.includes("Failed to fetch") ||
      errorText.includes("dynamically imported module") ||
      errorText.includes("Loading chunk");

    if (isChunkLoad) {
      const lastReloaded = sessionStorage.getItem("last_chunk_reload");
      const now = Date.now();
      // If we haven't reloaded in the last 10 seconds, try to reload once automatically
      if (!lastReloaded || now - parseInt(lastReloaded, 10) > 10000) {
        sessionStorage.setItem("last_chunk_reload", now.toString());
        console.warn("Detected chunk/module load failure. Attempting automatic page reload...");
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback 
        error={this.state.error}
        isChunkLoadError={this.state.isChunkLoadError}
        onReload={this.handleReload}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

interface FallbackProps {
  error: Error | null;
  isChunkLoadError: boolean;
  onReload: () => void;
  onGoHome: () => void;
}

const ErrorBoundaryFallback = ({ error, isChunkLoadError, onReload, onGoHome }: FallbackProps) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      {/* Premium Glassmorphism Container */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-xl text-center flex flex-col items-center relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-destructive/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-6 text-destructive animate-pulse">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          {isChunkLoadError ? "Connection Interrupted" : "Something went wrong"}
        </h1>
        
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-sm">
          {isChunkLoadError
            ? "We were unable to load the page because your connection dropped or changed. Please check your internet connection and try reloading."
            : "An unexpected application error occurred. We have logged the error and are working on fixing it."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mb-6">
          <Button onClick={onReload} variant="default" className="flex items-center gap-2 px-6">
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </Button>
          <Button onClick={onGoHome} variant="outline" className="flex items-center gap-2 px-6">
            <Home className="w-4 h-4" />
            Go to Home
          </Button>
        </div>

        {error && (
          <div className="w-full text-left border-t border-border pt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              {showDetails ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
              Technical Details
            </button>
            
            {showDetails && (
              <pre className="mt-2 p-3 bg-muted rounded-md text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-40 border border-border scrollbar-thin">
                {error.name}: {error.message}
                {"\n\nURL: " + window.location.href}
                {error.stack && "\n\nStack:\n" + error.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
