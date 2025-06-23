
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Crown, Building } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      description: "Parfait pour tester Clara",
      icon: Zap,
      badge: null,
      features: [
        "100 appels/mois",
        "1 IA personnalisée",
        "Support email",
        "Tableau de bord basique",
        "Intégration simple"
      ],
      limitations: [
        "Marque Thalya visible",
        "Fonctionnalités limitées"
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
      badge: "Plus populaire",
      features: [
        "2 000 appels/mois",
        "3 IA personnalisées",
        "Support prioritaire",
        "Analytics avancés",
        "Intégrations multiples",
        "Marque personnalisée",
        "Horaires d'ouverture",
        "Transfert d'appels"
      ],
      limitations: [],
      cta: "Démarrer l'essai gratuit",
      ctaVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "199€",
      period: "/mois",
      description: "Solution complète pour grandes entreprises",
      icon: Building,
      badge: "Solution complète",
      features: [
        "Appels illimités",
        "IA illimitées",
        "Support dédié 24/7",
        "API complète",
        "Intégrations sur mesure",
        "SLA garantie",
        "Formation équipe",
        "Déploiement multi-sites",
        "Conformité RGPD+"
      ],
      limitations: [],
      cta: "Contacter l'équipe",
      ctaVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-pure-white via-graphite-50 to-electric-blue/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 mb-6 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 font-medium">
            <Crown className="w-5 h-5 mr-2" />
            Tarification transparente
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-deep-black">
            Choisissez votre plan
            <br />
            <span className="text-gradient">démarrez gratuitement</span>
          </h2>
          
          <p className="text-xl text-graphite-600 max-w-3xl mx-auto">
            Pas de frais cachés, pas d'engagement. Évoluez selon vos besoins avec des tarifs adaptés à chaque étape de votre croissance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative overflow-hidden ${
                  plan.popular 
                    ? 'border-2 border-electric-blue shadow-2xl scale-105' 
                    : 'border border-graphite-200 hover:shadow-xl'
                } transition-all duration-300`}
              >
                {plan.badge && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-electric-blue text-white px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-deep-black mb-2">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-black text-deep-black">{plan.price}</span>
                    <span className="text-graphite-500">{plan.period}</span>
                  </div>
                  
                  <p className="text-graphite-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-graphite-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-graphite-200">
                      <p className="text-xs text-graphite-500 mb-2">Limitations :</p>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <p key={limitIndex} className="text-xs text-graphite-400">
                          • {limitation}
                        </p>
                      ))}
                    </div>
                  )}

                  <Button 
                    className={`w-full py-3 font-semibold ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-electric-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white'
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

        {/* FAQ Pricing */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-deep-black mb-8">Questions fréquentes</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-deep-black mb-2">Puis-je changer de plan à tout moment ?</h4>
              <p className="text-sm text-graphite-600">Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-deep-black mb-2">Que se passe-t-il si je dépasse mon quota ?</h4>
              <p className="text-sm text-graphite-600">Votre IA continue de fonctionner. Nous vous proposons automatiquement de passer au plan supérieur.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-deep-black mb-2">L'essai gratuit nécessite-t-il une carte bancaire ?</h4>
              <p className="text-sm text-graphite-600">Non, vous pouvez tester toutes les fonctionnalités Pro pendant 14 jours sans aucune carte bancaire.</p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-deep-black mb-2">Proposez-vous des remises pour les associations ?</h4>
              <p className="text-sm text-graphite-600">Oui, nous offrons 50% de réduction pour les associations et organisations à but non lucratif.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
