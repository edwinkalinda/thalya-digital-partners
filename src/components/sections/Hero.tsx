
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Phone, Calendar, MessageSquare, Shield, Zap, Users, Utensils, Building, Stethoscope, User, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { Badge } from '@/components/ui/badge';

const Hero = () => {
  const navigate = useNavigate();

  const verticals = [
    { name: 'Restaurants', icon: Utensils },
    { name: 'Hôtels', icon: Building },
    { name: 'Cliniques', icon: Stethoscope },
    { name: 'Cabinets dentaires', icon: User },
    { name: 'Immobilier', icon: Home },
    { name: 'Centres de beauté', icon: Sparkles }
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
        
        {/* Hero principal avec animations */}
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <Badge 
            variant="outline" 
            className="mb-4 px-2 py-1 text-xs font-medium text-graphite-600 border-graphite-300 animate-slide-up"
          >
            IA conversationnelle temps réel
          </Badge>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-black mb-4 leading-tight animate-slide-up">
            L'IA qui transforme
            <span className="block text-electric-blue">vos interactions clients</span>
          </h1>
          
          <p className="text-base md:text-lg text-graphite-600 mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-1000">
            Automatisez réservations et rendez-vous avec une IA vocale ultra-réactive. 
            Intégration native avec vos outils existants.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 animate-scale-in animation-delay-2000">
            <Button 
              onClick={() => navigate('/voice-configuration')}
              className="bg-electric-blue hover:bg-blue-600 text-white px-6 py-3 text-sm font-medium hover-scale"
            >
              Créer mon IA
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-graphite-300 text-graphite-700 hover:border-electric-blue hover:text-electric-blue px-6 py-3 text-sm"
            >
              Voir la démo
            </Button>
          </div>

          {/* Stats avec animations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-fade-in animation-delay-1000">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover-scale">
                <div className="text-xl font-bold text-deep-black">{stat.value}</div>
                <div className="text-sm text-graphite-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Secteurs supportés avec animations */}
        <div className="max-w-5xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-lg font-semibold text-deep-black text-center mb-6">
            Secteurs supportés
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {verticals.map((vertical, index) => {
              const IconComponent = vertical.icon;
              return (
                <Card key={index} className="p-4 text-center hover:shadow-md transition-all duration-300 border-graphite-200 hover-scale">
                  <div className="w-6 h-6 mx-auto mb-2 text-graphite-600">
                    <IconComponent className="w-full h-full" />
                  </div>
                  <div className="text-xs text-graphite-600">{vertical.name}</div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Intégrations avec animations */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in animation-delay-1000">
          <h2 className="text-lg font-semibold text-deep-black text-center mb-3">
            Intégrations natives
          </h2>
          <p className="text-sm text-graphite-600 text-center mb-6">
            Connectez Thalya à vos outils existants en quelques clics
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {integrations.map((integration, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-3 py-1 text-xs bg-graphite-100 text-graphite-700 hover-scale"
              >
                {integration}
              </Badge>
            ))}
          </div>
        </div>

        {/* Features clés avec animations */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 animate-fade-in animation-delay-2000">
          <Card className="p-6 border-graphite-200 hover-scale">
            <div className="w-10 h-10 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-electric-blue" />
            </div>
            <h3 className="text-base font-semibold text-deep-black mb-3">Ultra-réactif</h3>
            <p className="text-sm text-graphite-600">
              Latence inférieure à 200ms avec GPT-4o et synthèse vocale temps réel
            </p>
          </Card>

          <Card className="p-6 border-graphite-200 hover-scale">
            <div className="w-10 h-10 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-electric-blue" />
            </div>
            <h3 className="text-base font-semibold text-deep-black mb-3">Sécurisé</h3>
            <p className="text-sm text-graphite-600">
              Conformité RGPD et chiffrement bout en bout
            </p>
          </Card>

          <Card className="p-6 border-graphite-200 hover-scale">
            <div className="w-10 h-10 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-electric-blue" />
            </div>
            <h3 className="text-base font-semibold text-deep-black mb-3">Personnalisé</h3>
            <p className="text-sm text-graphite-600">
              IA adaptée à votre secteur et vos besoins spécifiques
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
