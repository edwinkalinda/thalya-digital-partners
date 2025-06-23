
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  return (
    <section className="py-24 px-6 lg:px-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">
          Prêt à transformer votre business ?
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Rejoignez les entreprises qui ont déjà fait le choix de l'excellence avec Thalya.
        </p>
        
        <Button 
          onClick={handleStartOnboarding}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-xl mb-6"
          size="lg"
        >
          Commencer maintenant
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
        
        <p className="text-gray-400 text-sm">
          Configuration en moins de 5 minutes • Aucun engagement • Support premium inclus
        </p>
        
        <div className="mt-16 pt-12 border-t border-gray-800">
          <p className="text-gray-500 mb-8">
            Déjà adopté par plus de 500 entreprises
          </p>
          <div className="flex items-center justify-center space-x-12 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-24 h-12 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
