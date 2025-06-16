import { useState, useEffect } from 'react';
import { Home } from "lucide-react";
import Header from "@/components/layout/Header";
import { PageHeader } from "@/components/layout/PageHeader";
import { RealEstateStats } from "@/components/real-estate/RealEstateStats";
import { RecentItemsList } from "@/components/dashboard/RecentItemsList";
import { useSecureSupabaseQuery } from "@/hooks/useSecureSupabaseQuery";
import { motion } from "framer-motion";

interface RealEstateLead {
  id: string;
  client_name: string;
  phone_number: string;
  email?: string;
  property_type?: string;
  budget_range?: string;
  status?: string;
  created_at: string;
}

const RealEstateDashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    activeLeads: 0
  });

  const { data: leads, loading } = useSecureSupabaseQuery<RealEstateLead>({
    table: 'real_estate_leads',
    orderBy: { column: 'created_at', ascending: false },
    limit: 10
  });

  useEffect(() => {
    if (leads) {
      const newLeads = leads.filter(l => l.status === 'new').length;
      const activeLeads = leads.filter(l => l.status !== 'closed').length;

      setStats({
        totalLeads: leads.length,
        newLeads,
        activeLeads
      });
    }
  }, [leads]);

  const leadItems = leads.map(lead => ({
    id: lead.id,
    name: lead.client_name,
    description: `${lead.property_type || 'Type non spécifié'}${lead.budget_range ? ` - Budget: ${lead.budget_range}` : ''}`,
    status: lead.status || 'nouveau',
    date: lead.created_at,
    icon: <Home className="w-5 h-5 text-green-600" />,
    gradient: 'bg-gradient-to-r from-green-50 to-white',
    borderColor: 'border-green-200'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <PageHeader
            title="Tableau de bord Immobilier"
            subtitle="Gestion des prospects et visites"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RealEstateStats stats={stats} />
          </motion.div>

          <RecentItemsList
            title="Prospects récents"
            items={leadItems}
            loading={loading}
            emptyMessage="Aucun prospect immobilier enregistré"
            emptyIcon={Home}
            emptyActionLabel="Ajouter un prospect"
          />
        </div>
      </div>
    </div>
  );
};

export default RealEstateDashboard;
