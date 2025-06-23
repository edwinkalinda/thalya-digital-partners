
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Crown, Building } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      description: "Parfait pour tester Clara",
      icon: Zap,
      features: [
        "100 appels/mois",
        "1 IA personnalisée",
        "Support email",
        "Tableau de bord basique"
      ],
      cta: "Commencer gratuitement",
      ctaVariant: "outline" as const,
      popular: false
    },
    {
      name: "Pro",
      price: "49€",
      period: "/mois",
      description: "Pour les entreprises en croissance",
      icon: Crown,
      features: [
        "2 000 appels/mois",
        "3 IA personnalisées",
        "Support prioritaire",
        "Analytics avancés",
        "Intégrations multiples",
        "Marque personnalisée"
      ],
      cta: "Démarrer l'essai gratuit",
      ctaVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "199€",
      period: "/mois",
      description: "Solution complète",
      icon: Building,
      features: [
        "Appels illimités",
        "IA illimitées",
        "Support dédié 24/7",
        "API complète",
        "Déploiement multi-sites",
        "Conformité RGPD+"
      ],
      cta: "Contacter l'équipe",
      ctaVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900">
            Choisissez votre plan
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pas de frais cachés, pas d'engagement. Évoluez selon vos besoins.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative ${
                  plan.popular 
                    ? 'border-2 border-blue-600 shadow-xl' 
                    : 'border border-gray-200 shadow-sm'
                } transition-shadow duration-200 hover:shadow-lg`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Plus populaire
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full py-3 font-medium rounded-xl ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : ''
                    }`}
                    variant={plan.ctaVariant}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 mb-8">Questions fréquentes</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Puis-je changer de plan ?</h4>
              <p className="text-gray-600">Oui, vous pouvez upgrader ou downgrader à tout moment.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Essai gratuit sans carte ?</h4>
              <p className="text-gray-600">Oui, testez toutes les fonctionnalités Pro pendant 14 jours.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
