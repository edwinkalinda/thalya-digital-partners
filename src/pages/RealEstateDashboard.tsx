
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Phone, MapPin, FileText, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { supabase } from '@/integrations/supabase/client';

interface RealEstateLead {
  id: string;
  client_name: string;
  phone_number: string;
  email?: string;
  property_type?: string;
  budget_range?: string;
  preferred_area?: string;
  status: string;
  notes?: string;
  created_at: string;
}

const RealEstateDashboard = () => {
  const [leads, setLeads] = useState<RealEstateLead[]>([]);
  const [stats, setStats] = useState({
    todayLeads: 0,
    totalProperties: 0,
    pendingLeads: 0
  });

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('real_estate_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setLeads(data);
    }
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayData } = await supabase
      .from('real_estate_leads')
      .select('id')
      .gte('created_at', today)
      .lt('created_at', today + 'T23:59:59');

    const { data: totalData } = await supabase
      .from('real_estate_leads')
      .select('property_type');

    const { data: pendingData } = await supabase
      .from('real_estate_leads')
      .select('id')
      .eq('status', 'new');

    const uniqueProperties = new Set(totalData?.map(item => item.property_type).filter(Boolean)).size;

    setStats({
      todayLeads: todayData?.length || 0,
      totalProperties: uniqueProperties || 0,
      pendingLeads: pendingData?.length || 0
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
              Tableau de bord Immobilier
            </h1>
            <p className="text-xl text-graphite-600">
              Gestion des prospects et propriétés
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Aujourd'hui
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.todayLeads}</p>
                <p className="text-sm text-green-700">Nouveaux prospects</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProperties}</p>
                <p className="text-sm text-blue-700">Types de biens</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  En attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingLeads}</p>
                <p className="text-sm text-orange-700">Prospects à traiter</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-deep-black flex items-center">
                <Activity className="w-6 h-6 mr-2 text-electric-blue" />
                Prospects récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep-black">{lead.client_name}</p>
                        <p className="text-sm text-graphite-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {lead.preferred_area || 'Zone non spécifiée'}
                        </p>
                        <p className="text-sm text-graphite-600 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {lead.phone_number}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-deep-black">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-graphite-600">
                        {lead.property_type || 'Type non spécifié'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealEstateDashboard;
