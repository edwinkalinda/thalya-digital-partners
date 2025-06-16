
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Mail, Users, TrendingUp } from "lucide-react";

interface OutreachStatsProps {
  stats: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalLeads: number;
    contactedLeads: number;
  };
}

export const OutreachStats = ({ stats }: OutreachStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsCard
        title="Campagnes"
        value={stats.totalCampaigns}
        description="Total campagnes"
        icon={Mail}
        gradient="bg-gradient-to-br from-purple-50 to-white"
        borderColor="border-purple-200"
        iconColor="text-purple-800"
        valueColor="text-purple-600"
      />
      <StatsCard
        title="Actives"
        value={stats.activeCampaigns}
        description="Campagnes actives"
        icon={TrendingUp}
        gradient="bg-gradient-to-br from-green-50 to-white"
        borderColor="border-green-200"
        iconColor="text-green-800"
        valueColor="text-green-600"
      />
      <StatsCard
        title="Prospects"
        value={stats.totalLeads}
        description="Total prospects"
        icon={Users}
        gradient="bg-gradient-to-br from-blue-50 to-white"
        borderColor="border-blue-200"
        iconColor="text-blue-800"
        valueColor="text-blue-600"
      />
      <StatsCard
        title="Contactés"
        value={stats.contactedLeads}
        description="Prospects contactés"
        icon={Mail}
        gradient="bg-gradient-to-br from-orange-50 to-white"
        borderColor="border-orange-200"
        iconColor="text-orange-800"
        valueColor="text-orange-600"
      />
    </div>
  );
};
