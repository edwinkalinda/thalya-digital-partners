
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Phone, Calendar, MessageSquare, Shield, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { Badge } from '@/components/ui/badge';

const Hero = () => {
  const navigate = useNavigate();

  const verticals = [
    { name: 'Restaurants', icon: '🍽️' },
    { name: 'Hôtels', icon: '🏨' },
    { name: 'Cliniques', icon: '🏥' },
    { name: 'Cabinets dentaires', icon: '🦷' },
    { name: 'Immobilier', icon: '🏠' },
    { name: 'Centres de beauté', icon: '💄' }
  ];

  const integrations = [
    'Calendly', 'Google Calendar', 'Stripe', 'Notion', 'HubSpot', 'Salesforce'
  ];

  const stats = [
    { value: '< 200ms', label: 'Latence' },
    { value: '24/7', label: 'Disponibilité' },
    { value: '12+', label: 'Secteurs' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-pure-white to-graphite-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero principal */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Badge 
            variant="outline" 
            className="mb-4 px-2 py-1 text-xs font-medium text-graphite-600 border-graphite-300"
          >
            IA conversationnelle temps réel
          </Badge>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-deep-black mb-4 leading-tight">
            L'IA qui transforme
            <span className="block text-electric-blue">vos interactions clients</span>
          </h1>
          
          <p className="text-sm md:text-base text-graphite-600 mb-6 max-w-2xl mx-auto leading-relaxed">
            Automatisez réservations et rendez-vous avec une IA vocale ultra-réactive. 
            Intégration native avec vos outils existants.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8">
            <Button 
              onClick={() => navigate('/voice-configuration')}
              className="bg-electric-blue hover:bg-blue-600 text-white px-4 py-2 text-xs font-medium"
            >
              Créer mon IA
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-graphite-300 text-graphite-700 hover:border-electric-blue hover:text-electric-blue px-4 py-2 text-xs"
            >
              Voir la démo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-deep-black">{stat.value}</div>
                <div className="text-xs text-graphite-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Secteurs supportés */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-lg font-semibold text-deep-black text-center mb-6">
            Secteurs supportés
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {verticals.map((vertical, index) => (
              <Card key={index} className="p-3 text-center hover:shadow-sm transition-shadow border-graphite-200">
                <div className="text-lg mb-1">{vertical.icon}</div>
                <div className="text-xs text-graphite-600">{vertical.name}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Intégrations */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-lg font-semibold text-deep-black text-center mb-3">
            Intégrations natives
          </h2>
          <p className="text-xs text-graphite-600 text-center mb-6">
            Connectez Thalya à vos outils existants en quelques clics
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {integrations.map((integration, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-2 py-1 text-xs bg-graphite-100 text-graphite-700"
              >
                {integration}
              </Badge>
            ))}
          </div>
        </div>

        {/* Features clés */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <Card className="p-4 border-graphite-200">
            <div className="w-8 h-8 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-3">
              <Zap className="w-4 h-4 text-electric-blue" />
            </div>
            <h3 className="text-sm font-semibold text-deep-black mb-2">Ultra-réactif</h3>
            <p className="text-xs text-graphite-600">
              Latence inférieure à 200ms avec GPT-4o et synthèse vocale temps réel
            </p>
          </Card>

          <Card className="p-4 border-graphite-200">
            <div className="w-8 h-8 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-4 h-4 text-electric-blue" />
            </div>
            <h3 className="text-sm font-semibold text-deep-black mb-2">Sécurisé</h3>
            <p className="text-xs text-graphite-600">
              Conformité RGPD et chiffrement bout en bout
            </p>
          </Card>

          <Card className="p-4 border-graphite-200">
            <div className="w-8 h-8 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-electric-blue" />
            </div>
            <h3 className="text-sm font-semibold text-deep-black mb-2">Personnalisé</h3>
            <p className="text-xs text-graphite-600">
              IA adaptée à votre secteur et vos besoins spécifiques
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
