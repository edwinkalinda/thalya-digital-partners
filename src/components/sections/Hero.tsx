
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight, CheckCircle, Sparkles, Building, Phone, Brain } from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";
import StarBorder from "@/components/ui/StarBorder";
import TextCycler from "@/components/ui/TextCycler";

const Hero = () => {
  const navigate = useNavigate();

  const trustIndicators = [
    "Gestion de stocks optimisée",
    "Support client 24/7 automatisé", 
    "Processus métier fluidifiés"
  ];

  const specializations = [
    "Automatisation intelligente",
    "IA conversationnelle avancée",
    "Optimisation des processus",
    "Croissance accélérée"
  ];

  const verticals = [
    {
      icon: Building,
      name: "Restaurants",
      description: "Réservations automatisées",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Phone,
      name: "Hôtels",
      description: "Accueil 24/7",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Brain,
      name: "Cliniques",
      description: "Prise de rendez-vous",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-16">
      {/* Advanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pure-white via-graphite-50 to-electric-blue/5"></div>
      
      {/* Animated Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-electric-blue/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-electric-blue/5 to-emerald-500/5 rounded-full blur-lg animate-pulse animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          {/* Enterprise Badge */}
          <div className="inline-flex items-center px-6 py-3 mb-8 bg-gradient-to-r from-electric-blue/10 to-emerald-500/10 border border-electric-blue/20 rounded-full text-electric-blue font-semibold text-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Solution IA Entreprise de Nouvelle Génération
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-[0.9]">
            <DecryptedText 
              text="Thalya révolutionne"
              animateOn="view"
              sequential={true}
              speed={40}
              revealDirection="center"
              className="text-deep-black block mb-3"
              encryptedClassName="text-electric-blue/40"
            />
            <DecryptedText 
              text="votre business"
              animateOn="view"
              sequential={true}
              speed={40}
              revealDirection="center"
              className="text-gradient block"
              encryptedClassName="text-electric-blue/40"
            />
          </h1>
          
          {/* Enterprise Subtitle */}
          <div className="mb-10">
            <p className="text-2xl sm:text-3xl lg:text-4xl text-graphite-800 max-w-5xl mx-auto mb-6 font-bold leading-tight">
              Intelligence Artificielle Conversationnelle Avancée
            </p>
            <p className="text-xl sm:text-2xl text-graphite-600 max-w-4xl mx-auto leading-relaxed font-light">
              Automatisation complète des interactions clients, intégration native avec vos outils existants, croissance exponentielle garantie.
            </p>
          </div>
          
          {/* Dynamic Specializations */}
          <div className="mb-12 p-8 bg-pure-white/80 border border-graphite-200/60 rounded-3xl backdrop-blur-sm max-w-3xl mx-auto shadow-lg">
            <div className="text-lg text-graphite-700 mb-6 font-semibold">Excellence technique en :</div>
            <TextCycler
              texts={specializations}
              className="text-3xl sm:text-4xl text-electric-blue font-black"
              interval={2500}
              splitBy="characters"
              staggerDuration={30}
            />
          </div>
          
          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <StarBorder 
              color="#0066FF"
              speed="4s"
              className="transition-all duration-300 hover:scale-105 group shadow-2xl shadow-electric-blue/30"
              onClick={() => navigate('/voice-configuration')}
            >
              <span className="flex items-center gap-4 text-xl font-black px-8 py-2">
                <Brain className="w-6 h-6" />
                Configurer mon IA maintenant
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
            </StarBorder>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-graphite-400 text-graphite-700 hover:bg-graphite-50 hover:border-electric-blue/50 hover:text-electric-blue px-8 py-6 text-xl font-bold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-electric-blue/20 group"
            >
              <Play className="w-6 h-6 mr-3 transition-transform group-hover:scale-125" />
              Voir la démo complète
            </Button>
          </div>

          {/* Verticals Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-graphite-800 mb-8">Secteurs d'activité supportés</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {verticals.map((vertical, index) => (
                <div 
                  key={index}
                  className="group p-6 rounded-2xl bg-pure-white/90 border border-graphite-200/60 hover:border-electric-blue/30 hover:bg-electric-blue/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${vertical.color} p-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    <vertical.icon className="w-full h-full text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-graphite-800 mb-2">{vertical.name}</h4>
                  <p className="text-sm text-graphite-600">{vertical.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Integration Promise */}
          <div className="mb-16 p-8 bg-gradient-to-r from-electric-blue/5 via-emerald-500/5 to-electric-blue/5 rounded-3xl border border-electric-blue/20">
            <h3 className="text-2xl font-bold text-graphite-800 mb-4">Intégration Native Complète</h3>
            <p className="text-graphite-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Thalya s'intègre parfaitement avec vos outils existants : CRM, systèmes de réservation, 
              calendriers, outils de paiement. Aucune migration nécessaire, mise en œuvre immédiate.
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="mb-16">
            <p className="text-lg text-graphite-700 mb-8 font-semibold">Déjà adopté par des entreprises leaders</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {trustIndicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-center sm:justify-start space-x-4 p-6 rounded-2xl bg-pure-white/80 border border-graphite-200/60 hover:border-electric-blue/30 hover:bg-electric-blue/5 transition-all duration-300 group shadow-sm hover:shadow-lg"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CheckCircle className="w-7 h-7 text-emerald-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="text-lg text-graphite-700 font-semibold text-center sm:text-left">
                    {indicator}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto p-10 bg-gradient-to-r from-electric-blue/8 via-emerald-500/5 to-electric-blue/8 rounded-3xl border border-electric-blue/20 shadow-2xl">
            <div className="text-center group">
              <div className="text-5xl sm:text-6xl font-black text-electric-blue mb-4 group-hover:scale-110 transition-transform">99.9%</div>
              <div className="text-lg text-graphite-700 font-semibold">Disponibilité Enterprise</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl sm:text-6xl font-black text-electric-blue mb-4 group-hover:scale-110 transition-transform">&lt;100ms</div>
              <div className="text-lg text-graphite-700 font-semibold">Latence ultra-faible</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl sm:text-6xl font-black text-electric-blue mb-4 group-hover:scale-110 transition-transform">+300%</div>
              <div className="text-lg text-graphite-700 font-semibold">ROI moyen clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
