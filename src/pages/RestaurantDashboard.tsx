
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Phone, MapPin, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { supabase } from '@/integrations/supabase/client';

interface RestaurantReservation {
  id: string;
  customer_name: string;
  party_size: number;
  reservation_time: string;
  status: string;
  special_requests?: string;
  created_at: string;
}

const RestaurantDashboard = () => {
  const [reservations, setReservations] = useState<RestaurantReservation[]>([]);
  const [stats, setStats] = useState({
    todayReservations: 0,
    totalCovers: 0,
    pendingReservations: 0
  });

  useEffect(() => {
    fetchReservations();
    fetchStats();
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from('restaurant_reservations')
      .select('*')
      .order('reservation_time', { ascending: true })
      .limit(10);

    if (!error && data) {
      setReservations(data);
    }
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayData } = await supabase
      .from('restaurant_reservations')
      .select('id, party_size')
      .gte('reservation_time', today)
      .lt('reservation_time', today + 'T23:59:59');

    const { data: pendingData } = await supabase
      .from('restaurant_reservations')
      .select('id')
      .eq('status', 'pending');

    const totalCovers = todayData?.reduce((sum, res) => sum + res.party_size, 0) || 0;

    setStats({
      todayReservations: todayData?.length || 0,
      totalCovers,
      pendingReservations: pendingData?.length || 0
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
              Tableau de bord Restaurant
            </h1>
            <p className="text-xl text-graphite-600">
              Gestion des réservations et service
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Aujourd'hui
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{stats.todayReservations}</p>
                <p className="text-sm text-orange-700">Réservations du jour</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Couverts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.totalCovers}</p>
                <p className="text-sm text-green-700">Total couverts aujourd'hui</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  En attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{stats.pendingReservations}</p>
                <p className="text-sm text-blue-700">Réservations en attente</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reservations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-deep-black flex items-center">
                <Activity className="w-6 h-6 mr-2 text-electric-blue" />
                Réservations récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep-black">{reservation.customer_name}</p>
                        <p className="text-sm text-graphite-600">{reservation.party_size} personnes</p>
                        {reservation.special_requests && (
                          <p className="text-xs text-graphite-500">{reservation.special_requests}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-deep-black">
                        {new Date(reservation.reservation_time).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-graphite-600">
                        {new Date(reservation.reservation_time).toLocaleTimeString('fr-FR', { 
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

export default RestaurantDashboard;
