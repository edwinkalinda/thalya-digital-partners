
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      link: "/voice-management"
    },
    {
      title: "Configuration IA",
      description: "Personnaliser Clara",
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
      link: "/ai-config"
    },
    {
      title: "Nouvelle IA",
      description: "Créer une assistante",
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      link: "/onboarding"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action) => (
        <Card key={action.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-3`}>
              <action.icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <CardTitle className="text-lg font-semibold text-deep-black">
              {action.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-graphite-600 mb-4 text-sm">
              {action.description}
            </p>
            <Link to={action.link}>
              <Button className={`w-full ${action.buttonColor} text-white`}>
                Accéder
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
