import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Mail, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { OutreachStats } from "@/components/outreach/OutreachStats";
import { RecentItemsList } from "@/components/dashboard/RecentItemsList";
import { useSecureSupabaseQuery } from "@/hooks/useSecureSupabaseQuery";
import { motion } from "framer-motion";

interface OutreachCampaign {
  id: string;
  title: string;
  description?: string;
  status?: string;
  created_at: string;
}

interface OutreachLead {
  id: string;
  name: string;
  email: string;
  status?: string;
  created_at: string;
}

const OutreachDashboard = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalLeads: 0,
    contactedLeads: 0
  });

  const { data: campaigns, loading: campaignsLoading } = useSecureSupabaseQuery<OutreachCampaign>({
    table: 'outreach_campaigns',
    orderBy: { column: 'created_at', ascending: false },
    limit: 10
  });

  const { data: leads, loading: leadsLoading } = useSecureSupabaseQuery<OutreachLead>({
    table: 'outreach_leads',
    orderBy: { column: 'created_at', ascending: false },
    limit: 10
  });

  useEffect(() => {
    if (campaigns && leads) {
      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      const contactedLeads = leads.filter(l => l.status === 'contacted').length;

      setStats({
        totalCampaigns: campaigns.length,
        activeCampaigns,
        totalLeads: leads.length,
        contactedLeads
      });
    }
  }, [campaigns, leads]);

  const campaignItems = campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.title,
    description: campaign.description || 'Aucune description',
    status: campaign.status || 'draft',
    date: campaign.created_at,
    gradient: 'bg-gradient-to-r from-purple-50 to-white',
    borderColor: 'border-purple-200'
  }));

  const leadItems = leads.map(lead => ({
    id: lead.id,
    name: lead.name,
    description: lead.email,
    status: lead.status || 'new',
    date: lead.created_at,
    gradient: 'bg-gradient-to-r from-blue-50 to-white',
    borderColor: 'border-blue-200'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <PageHeader
            title="Tableau de bord Outreach"
            subtitle="Gestion des campagnes et prospects"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button className="bg-electric-blue hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle campagne
              </Button>
            </motion.div>
          </PageHeader>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <OutreachStats stats={stats} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentItemsList
              title="Campagnes récentes"
              items={campaignItems}
              loading={campaignsLoading}
              emptyMessage="Aucune campagne créée pour le moment"
              emptyIcon={Mail}
              emptyActionLabel="Créer une campagne"
            />
            <RecentItemsList
              title="Prospects récents"
              items={leadItems}
              loading={leadsLoading}
              emptyMessage="Aucun prospect enregistré"
              emptyIcon={Users}
              emptyActionLabel="Importer des prospects"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutreachDashboard;
