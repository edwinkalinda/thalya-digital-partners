
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  borderColor: string;
  iconColor: string;
  valueColor: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  gradient, 
  borderColor, 
  iconColor, 
  valueColor 
}: StatsCardProps) => {
  return (
    <Card className={`border-2 ${borderColor} ${gradient}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg ${iconColor} flex items-center`}>
          <Icon className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        <p className={`text-sm ${iconColor.replace('800', '700')}`}>{description}</p>
      </CardContent>
    </Card>
  );
};
