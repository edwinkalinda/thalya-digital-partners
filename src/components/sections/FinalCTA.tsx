
import { ArrowRight, Sparkles } from "lucide-react";
import StarBorder from "@/components/ui/StarBorder";

const FinalCTA = () => {
  return (
    <section className="py-24 px-6 lg:px-8 bg-deep-black text-pure-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 via-transparent to-blue-600/10"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-electric-blue/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-electric-blue mr-3" />
            <span className="text-electric-blue font-semibold text-lg">
              L'avenir commence maintenant
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Prêt à transformer
            <br />
            <span className="text-gradient">votre business ?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-graphite-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Rejoignez les entreprises visionnaires qui ont déjà fait le choix de l'excellence avec Thalya. Votre première IA vous attend.
          </p>
          
          <div className="space-y-6">
            <StarBorder 
              color="#0066FF"
              speed="5s"
              className="transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center">
                Donner Vie à votre IA
                <ArrowRight className="w-6 h-6 ml-3" />
              </div>
            </StarBorder>
            
            <p className="text-graphite-400 text-sm">
              Configuration en moins de 5 minutes • Aucun engagement • Support premium inclus
            </p>
          </div>
          
          {/* Social proof */}
          <div className="mt-16 pt-12 border-t border-graphite-800">
            <p className="text-graphite-500 mb-8">
              Déjà adopté par plus de 500 entreprises
            </p>
            <div className="flex items-center justify-center space-x-12 opacity-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-12 bg-graphite-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
