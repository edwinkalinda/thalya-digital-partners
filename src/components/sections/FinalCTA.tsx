
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";

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
              <DecryptedText 
                text="L'avenir commence maintenant"
                animateOn="view"
                sequential={true}
                speed={40}
                className="text-electric-blue"
                encryptedClassName="text-pure-white/50"
              />
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <DecryptedText 
              text="Prêt à transformer"
              animateOn="view"
              sequential={true}
              speed={50}
              revealDirection="center"
              className="text-pure-white"
              encryptedClassName="text-electric-blue/60"
            />
            <br />
            <span className="text-gradient">
              <DecryptedText 
                text="votre business ?"
                animateOn="view"
                sequential={true}
                speed={45}
                className="text-gradient"
                encryptedClassName="text-electric-blue/70"
              />
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-graphite-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            <DecryptedText 
              text="Rejoignez les entreprises visionnaires qui ont déjà fait le choix de l'excellence avec Thalya. Votre première IA vous attend."
              animateOn="view"
              sequential={true}
              speed={30}
              className="text-graphite-300"
              encryptedClassName="text-electric-blue/40"
            />
          </p>
          
          <div className="space-y-6">
            <Button 
              size="lg" 
              className="bg-electric-blue hover:bg-blue-600 text-pure-white px-12 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105 animate-glow group"
            >
              <DecryptedText 
                text="Donner Vie à votre IA"
                animateOn="hover"
                speed={25}
                maxIterations={12}
                className="text-pure-white"
                encryptedClassName="text-electric-blue/80"
              />
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <p className="text-graphite-400 text-sm">
              <DecryptedText 
                text="Configuration en moins de 5 minutes • Aucun engagement • Support premium inclus"
                animateOn="view"
                speed={20}
                className="text-graphite-400"
                encryptedClassName="text-electric-blue/30"
              />
            </p>
          </div>
          
          {/* Social proof */}
          <div className="mt-16 pt-12 border-t border-graphite-800">
            <p className="text-graphite-500 mb-8">
              <DecryptedText 
                text="Déjà adopté par plus de 500 entreprises"
                animateOn="view"
                speed={40}
                className="text-graphite-500"
                encryptedClassName="text-electric-blue/40"
              />
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
