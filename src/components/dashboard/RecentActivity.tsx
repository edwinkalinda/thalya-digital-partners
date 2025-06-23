
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export const RecentActivity = () => {
  const activities = [
    {
      title: "Clara a géré 12 appels",
      time: "Il y a 2 heures",
      value: "+12 appels",
    },
    {
      title: "Configuration mise à jour",
      time: "Il y a 1 jour",
      value: "Modifié",
    },
    {
      title: "Nouveau client satisfait",
      time: "Il y a 2 jours",
      value: "⭐ 5/5",
    }
  ];

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-gray-700" />
          Activité récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                <p className="text-xs text-gray-600">{activity.time}</p>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {activity.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
