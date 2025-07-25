
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-2 border-electric-blue border-t-transparent",
          sizeClasses[size]
        )}
        role="status"
        aria-label="Chargement en cours"
      />
      {text && (
        <p className="text-sm text-graphite-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};
