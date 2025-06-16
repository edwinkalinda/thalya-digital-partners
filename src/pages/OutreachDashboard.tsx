
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Users, TrendingUp, Activity, Plus } from "lucide-react";
import Header from "@/components/layout/Header";
import { supabase } from '@/integrations/supabase/client';

interface OutreachCampaign {
  id: string;
  title: string;
  description?: string;
  status?: string;
  channels?: string[];
  message_template?: string;
  user_id?: string;
  created_at: string;
}

interface OutreachLead {
  id: string;
  campaign_id?: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  last_contacted_at?: string;
  created_at: string;
}

const OutreachDashboard = () => {
  const [campaigns, setCampaigns] = useState<OutreachCampaign[]>([]);
  const [leads, setLeads] = useState<OutreachLead[]>([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalLeads: 0,
    contactedLeads: 0
  });

  useEffect(() => {
    fetchCampaigns();
    fetchLeads();
    fetchStats();
  }, []);

  const fetchCampaigns = async () => {
    const { data, error } = await supabase
      .from('outreach_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setCampaigns(data);
    }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('outreach_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setLeads(data);
    }
  };

  const fetchStats = async () => {
    const { data: campaignsData } = await supabase
      .from('outreach_campaigns')
      .select('id, status');

    const { data: leadsData } = await supabase
      .from('outreach_leads')
      .select('id, last_contacted_at');

    const totalCampaigns = campaignsData?.length || 0;
    const activeCampaigns = campaignsData?.filter(c => c.status === 'active').length || 0;
    const totalLeads = leadsData?.length || 0;
    const contactedLeads = leadsData?.filter(l => l.last_contacted_at).length || 0;

    setStats({
      totalCampaigns,
      activeCampaigns,
      totalLeads,
      contactedLeads
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-deep-black">
              Tableau de bord Outreach
            </h1>
            <p className="text-xl text-graphite-600">
              Gestion des campagnes et prospects
            </p>
            <Button className="bg-electric-blue hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle campagne
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Campagnes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">{stats.totalCampaigns}</p>
                <p className="text-sm text-purple-700">Total campagnes</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.activeCampaigns}</p>
                <p className="text-sm text-green-700">Campagnes actives</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Prospects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{stats.totalLeads}</p>
                <p className="text-sm text-blue-700">Total prospects</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-800 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contactés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{stats.contactedLeads}</p>
                <p className="text-sm text-orange-700">Prospects contactés</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns and Leads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-deep-black flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-electric-blue" />
                  Campagnes récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-deep-black">{campaign.title}</p>
                          <p className="text-sm text-graphite-600">{campaign.description || 'Aucune description'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-deep-black capitalize">
                            {campaign.status || 'draft'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-deep-black flex items-center">
                  <Users className="w-6 h-6 mr-2 text-electric-blue" />
                  Prospects récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-deep-black">{lead.name}</p>
                          <p className="text-sm text-graphite-600">{lead.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-deep-black capitalize">
                            {lead.status || 'new'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutreachDashboard;
