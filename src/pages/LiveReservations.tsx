
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { supabase } from '@/integrations/supabase/client';

const LiveReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('restaurant_reservations')
      .select('*')
      .order('reservation_time', { ascending: true });

    if (!error && data) {
      setReservations(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-deep-black">
              Réservations en direct
            </h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-deep-black flex items-center">
                <Activity className="w-6 h-6 mr-2 text-electric-blue" />
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.map((reservation: any) => (
                  <div key={reservation.id} className="p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-deep-black">{reservation.customer_name}</p>
                        <p className="text-sm text-graphite-600">{reservation.party_size} personnes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-deep-black">
                          {new Date(reservation.reservation_time).toLocaleDateString('fr-FR')}
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

export default LiveReservations;
