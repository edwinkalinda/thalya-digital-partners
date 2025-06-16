
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-graphite-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-graphite-400" />
      </div>
      <h3 className="text-lg font-semibold text-deep-black mb-2">{title}</h3>
      <p className="text-graphite-600 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-electric-blue hover:bg-blue-600">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
