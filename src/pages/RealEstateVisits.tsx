
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { supabase } from '@/integrations/supabase/client';

const RealEstateVisits = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('real_estate_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-deep-black">
              Visites immobilières
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-deep-black flex items-center">
                <Activity className="w-6 h-6 mr-2 text-electric-blue" />
                Prospects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map((lead: any) => (
                  <div key={lead.id} className="p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-deep-black">{lead.client_name}</p>
                        <p className="text-sm text-graphite-600">{lead.property_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-deep-black">
                          {new Date(lead.created_at).toLocaleDateString('fr-FR')}
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
  );
};

export default RealEstateVisits;
