
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Phone, Brain, Users, BarChart3 } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalCalls: number;
    activeAgents: number;
    satisfaction: number;
    monthlyGrowth: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Appels ce mois"
        value={stats.totalCalls}
        description={`+${stats.monthlyGrowth}% vs mois dernier`}
        icon={Phone}
        gradient="bg-white"
        borderColor="border-gray-200"
        iconColor="text-gray-700"
        valueColor="text-gray-900"
      />
      <StatsCard
        title="Agents actifs"
        value={stats.activeAgents}
        description="Clara en service"
        icon={Brain}
        gradient="bg-white"
        borderColor="border-gray-200"
        iconColor="text-gray-700"
        valueColor="text-gray-900"
      />
      <StatsCard
        title="Satisfaction"
        value={stats.satisfaction}
        description="Note moyenne clients"
        icon={Users}
        gradient="bg-white"
        borderColor="border-gray-200"
        iconColor="text-gray-700"
        valueColor="text-gray-900"
      />
      <StatsCard
        title="Croissance"
        value={`+${stats.monthlyGrowth}%`}
        description="Ce mois vs précédent"
        icon={BarChart3}
        gradient="bg-white"
        borderColor="border-gray-200"
        iconColor="text-gray-700"
        valueColor="text-gray-900"
      />
    </div>
  );
};
