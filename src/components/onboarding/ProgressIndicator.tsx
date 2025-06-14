
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

const ProgressIndicator = ({ steps, currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          {/* Step Circle */}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
            index < currentStep 
              ? "bg-electric-blue text-pure-white" 
              : index === currentStep
                ? "bg-electric-blue/20 text-electric-blue border-2 border-electric-blue"
                : "bg-graphite-200 text-graphite-500"
          )}>
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>

          {/* Step Label */}
          <span className={cn(
            "text-sm font-medium transition-colors",
            index <= currentStep ? "text-deep-black" : "text-graphite-500"
          )}>
            {step}
          </span>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className={cn(
              "w-8 h-0.5 transition-colors",
              index < currentStep ? "bg-electric-blue" : "bg-graphite-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
