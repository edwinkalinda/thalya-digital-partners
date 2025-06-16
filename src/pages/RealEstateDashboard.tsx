
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Phone, MapPin, FileText, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { supabase } from '@/integrations/supabase/client';

interface RealEstateVisit {
  id: string;
  client_name: string;
  client_phone: string;
  property_address: string;
  preferred_date: string;
  status: string;
  notes?: string;
  created_at: string;
}

const RealEstateDashboard = () => {
  const [visits, setVisits] = useState<RealEstateVisit[]>([]);
  const [stats, setStats] = useState({
    todayVisits: 0,
    totalProperties: 0,
    pendingVisits: 0
  });

  useEffect(() => {
    fetchVisits();
    fetchStats();
  }, []);

  const fetchVisits = async () => {
    const { data, error } = await supabase
      .from('real_estate_visits')
      .select('*')
      .order('preferred_date', { ascending: true })
      .limit(10);

    if (!error && data) {
      setVisits(data);
    }
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayData } = await supabase
      .from('real_estate_visits')
      .select('id')
      .gte('preferred_date', today)
      .lt('preferred_date', today + 'T23:59:59');

    const { data: totalData } = await supabase
      .from('real_estate_visits')
      .select('property_address');

    const { data: pendingData } = await supabase
      .from('real_estate_visits')
      .select('id')
      .eq('status', 'pending');

    const uniqueProperties = new Set(totalData?.map(item => item.property_address)).size;

    setStats({
      todayVisits: todayData?.length || 0,
      totalProperties: uniqueProperties || 0,
      pendingVisits: pendingData?.length || 0
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
              Gestion des visites et propriétés
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
                <p className="text-3xl font-bold text-green-600">{stats.todayVisits}</p>
                <p className="text-sm text-green-700">Visites du jour</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Propriétés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProperties}</p>
                <p className="text-sm text-blue-700">Propriétés référencées</p>
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
                <p className="text-3xl font-bold text-orange-600">{stats.pendingVisits}</p>
                <p className="text-sm text-orange-700">Visites en attente</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Visits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-deep-black flex items-center">
                <Activity className="w-6 h-6 mr-2 text-electric-blue" />
                Visites récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Home className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep-black">{visit.client_name}</p>
                        <p className="text-sm text-graphite-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {visit.property_address}
                        </p>
                        <p className="text-sm text-graphite-600 flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {visit.client_phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-deep-black">
                        {new Date(visit.preferred_date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-graphite-600">
                        {new Date(visit.preferred_date).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
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
