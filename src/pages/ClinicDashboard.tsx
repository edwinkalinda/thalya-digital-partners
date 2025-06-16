
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Phone, FileText, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { supabase } from '@/integrations/supabase/client';

interface ClinicAppointment {
  id: string;
  patient_name: string;
  appointment_time: string;
  reason: string;
  practitioner_type: string;
  status: string;
  created_at: string;
}

const ClinicDashboard = () => {
  const [appointments, setAppointments] = useState<ClinicAppointment[]>([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0
  });

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('clinic_appointments')
      .select('*')
      .order('appointment_time', { ascending: true })
      .limit(10);

    if (!error && data) {
      setAppointments(data);
    }
  };

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayData } = await supabase
      .from('clinic_appointments')
      .select('id')
      .gte('appointment_time', today)
      .lt('appointment_time', today + 'T23:59:59');

    const { data: totalData } = await supabase
      .from('clinic_appointments')
      .select('id');

    const { data: pendingData } = await supabase
      .from('clinic_appointments')
      .select('id')
      .eq('status', 'pending');

    setStats({
      todayAppointments: todayData?.length || 0,
      totalPatients: totalData?.length || 0,
      pendingAppointments: pendingData?.length || 0
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
              Tableau de bord Clinique
            </h1>
            <p className="text-xl text-graphite-600">
              Gestion des rendez-vous et patients
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Aujourd'hui
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
                <p className="text-sm text-blue-700">Rendez-vous du jour</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Total Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
                <p className="text-sm text-green-700">Patients enregistrés</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-orange-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  En attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingAppointments}</p>
                <p className="text-sm text-orange-700">Rendez-vous en attente</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-deep-black flex items-center">
                <Activity className="w-6 h-6 mr-2 text-electric-blue" />
                Rendez-vous récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-deep-black">{appointment.patient_name}</p>
                        <p className="text-sm text-graphite-600">{appointment.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-deep-black">
                        {new Date(appointment.appointment_time).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-graphite-600">
                        {new Date(appointment.appointment_time).toLocaleTimeString('fr-FR', { 
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

export default ClinicDashboard;
