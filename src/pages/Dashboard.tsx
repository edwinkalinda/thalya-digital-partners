
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeAgents: 1,
    satisfaction: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalCalls: 142,
        activeAgents: 1,
        satisfaction: 4.8,
        monthlyGrowth: 23
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-graphite-50">
      <Header />
      
      <div className="pt-16 container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-deep-black">
              Tableau de bord
            </h1>
            <p className="text-graphite-600">
              Bienvenue {user?.user_metadata?.first_name || 'Admin'}
            </p>
          </div>

          {/* Stats */}
          <DashboardStats stats={stats} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
