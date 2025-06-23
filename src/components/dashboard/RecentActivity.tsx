
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export const RecentActivity = () => {
  const activities = [
    {
      title: "Clara a géré 12 appels",
      time: "Il y a 2 heures",
      value: "+12 appels",
      color: "text-green-600"
    },
    {
      title: "Configuration mise à jour",
      time: "Il y a 1 jour",
      value: "Modifié",
      color: "text-blue-600"
    },
    {
      title: "Nouveau client satisfait",
      time: "Il y a 2 jours",
      value: "⭐ 5/5",
      color: "text-purple-600"
    }
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-deep-black flex items-center">
          <Activity className="w-5 h-5 mr-2 text-electric-blue" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-graphite-50 rounded-lg">
              <div>
                <p className="font-medium text-deep-black text-sm">{activity.title}</p>
                <p className="text-xs text-graphite-600">{activity.time}</p>
              </div>
              <div className={`text-sm font-semibold ${activity.color}`}>
                {activity.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
