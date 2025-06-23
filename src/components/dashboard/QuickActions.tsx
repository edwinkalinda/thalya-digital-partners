
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Settings, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  const actions = [
    {
      title: "Gestion Vocale",
      description: "Interface de chat vocal avec Clara",
      icon: MessageCircle,
      link: "/voice-management"
    },
    {
      title: "Configuration IA",
      description: "Personnaliser Clara",
      icon: Settings,
      link: "/ai-config"
    },
    {
      title: "Nouvelle IA",
      description: "Créer une assistante",
      icon: Brain,
      link: "/onboarding"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action) => (
        <Card key={action.title} className="border-gray-200 bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <action.icon className="w-6 h-6 text-gray-700" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {action.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-600 mb-4 text-sm">
              {action.description}
            </p>
            <Link to={action.link}>
              <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                Accéder
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
