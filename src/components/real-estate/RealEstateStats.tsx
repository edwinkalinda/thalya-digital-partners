
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Home, Users, TrendingUp } from "lucide-react";

interface RealEstateStatsProps {
  stats: {
    totalLeads: number;
    newLeads: number;
    activeLeads: number;
  };
}

export const RealEstateStats = ({ stats }: RealEstateStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Prospects"
        value={stats.totalLeads}
        description="Prospects enregistrés"
        icon={Home}
        gradient="bg-gradient-to-br from-green-50 to-white"
        borderColor="border-green-200"
        iconColor="text-green-800"
        valueColor="text-green-600"
      />
      <StatsCard
        title="Nouveaux"
        value={stats.newLeads}
        description="Nouveaux prospects"
        icon={Users}
        gradient="bg-gradient-to-br from-blue-50 to-white"
        borderColor="border-blue-200"
        iconColor="text-blue-800"
        valueColor="text-blue-600"
      />
      <StatsCard
        title="Actifs"
        value={stats.activeLeads}
        description="Prospects actifs"
        icon={TrendingUp}
        gradient="bg-gradient-to-br from-orange-50 to-white"
        borderColor="border-orange-200"
        iconColor="text-orange-800"
        valueColor="text-orange-600"
      />
    </div>
  );
};
