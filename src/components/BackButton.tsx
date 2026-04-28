import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
  fallbackPath?: string;
}

/**
 * A reusable BackButton component that handles navigation.
 * It uses a provided onClick handler, or falls back to browser history.
 * If there's no history (e.g. after refresh), it can use a fallbackPath.
 */
export const BackButton = ({ onClick, className, label, fallbackPath }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onClick) {
      onClick();
      return;
    }
    
    // If we have history, go back. Otherwise go to fallback.
    if (window.history.length > 1) {
      navigate(-1);
    } else if (fallbackPath) {
      navigate(fallbackPath);
    } else {
      navigate("/");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`group flex items-center gap-2 px-2 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all ${className}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      </div>
      {label && <span className="font-medium text-sm">{label}</span>}
    </Button>
  );
};
