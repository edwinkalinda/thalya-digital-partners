
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TextRotate from "@/components/ui/TextRotate";
import { Phone, Package, TrendingUp } from "lucide-react";

const AIHub = () => {
  return (
    <section id="ai-hub" className="py-24 px-6 lg:px-8 bg-graphite-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <TextRotate text="Un agent pour " className="inline" />
            <span className="text-gradient">chaque mission</span>
          </h2>
          <p className="text-xl text-graphite-600 max-w-3xl mx-auto">
            Découvrez notre écosystème d'intelligences artificielles spécialisées, 
            chacune conçue pour exceller dans son domaine.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* IA Réceptionniste - Large card */}
          <div className="lg:col-span-2 lg:row-span-2 bg-pure-white rounded-3xl p-8 shadow-lg hover-scale border border-graphite-200 animate-slide-up">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-electric-blue/10 rounded-2xl">
                <Phone className="w-8 h-8 text-electric-blue" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>
            </div>
            
            <h3 className="text-3xl font-bold mb-4">IA Réceptionniste</h3>
            <p className="text-graphite-600 text-lg mb-8 leading-relaxed">
              Gère vos appels entrants 24/7 avec une voix naturelle et une personnalité 
              qui reflète parfaitement votre marque. Jamais d'appel manqué, toujours une 
              première impression exceptionnelle.
            </p>
            
            {/* Mock avatar */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-electric-blue to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <div className="w-16 h-16 bg-pure-white rounded-full flex items-center justify-center">
                  <div className="text-electric-blue text-xl font-bold">R</div>
                </div>
              </div>
            </div>
            
            <Button className="bg-electric-blue hover:bg-blue-600 text-pure-white w-full py-3 text-lg font-semibold rounded-xl">
              Configurer maintenant
            </Button>
          </div>

          {/* IA Gestion de Stock - Coming soon */}
          <div className="bg-pure-white rounded-3xl p-6 shadow-lg hover-scale border border-graphite-200 animate-slide-up relative overflow-hidden">
            <div className="glass-effect absolute inset-0"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-graphite-200 rounded-xl opacity-50">
                  <Package className="w-6 h-6 text-graphite-500" />
                </div>
                <Badge variant="secondary" className="bg-graphite-100 text-graphite-600">
                  Bientôt disponible
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-graphite-700">IA Gestion de Stock</h3>
              <p className="text-graphite-500 text-sm leading-relaxed">
                Optimise vos niveaux de stock en prédisant la demande et en automatisant 
                les commandes fournisseurs.
              </p>
            </div>
          </div>

          {/* IA Marketing - Coming soon */}
          <div className="bg-pure-white rounded-3xl p-6 shadow-lg hover-scale border border-graphite-200 animate-slide-up relative overflow-hidden">
            <div className="glass-effect absolute inset-0"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-graphite-200 rounded-xl opacity-50">
                  <TrendingUp className="w-6 h-6 text-graphite-500" />
                </div>
                <Badge variant="secondary" className="bg-graphite-100 text-graphite-600">
                  Bientôt disponible
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-graphite-700">IA Marketing</h3>
              <p className="text-graphite-500 text-sm leading-relaxed">
                Crée et lance des campagnes marketing ciblées en analysant le comportement 
                de vos clients en temps réel.
              </p>
            </div>
          </div>

          {/* Additional coming soon card for balance */}
          <div className="lg:col-span-2 bg-gradient-to-r from-electric-blue/5 to-blue-600/5 rounded-3xl p-6 border border-electric-blue/20 animate-slide-up">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-gradient">Et bien plus encore...</h3>
              <p className="text-graphite-600 mb-6">
                Notre écosystème d'IA s'enrichit constamment de nouvelles spécialisations 
                pour répondre à tous vos besoins métier.
              </p>
              <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-pure-white">
                Découvrir la roadmap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHub;
