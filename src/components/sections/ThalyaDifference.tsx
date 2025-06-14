
import { MessageCircle, User, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Onboarding Conversationnel",
    description: "Définissez la personnalité de votre IA en quelques minutes, simplement en discutant avec la nôtre."
  },
  {
    icon: User,
    title: "Identité Unique",
    description: "Chaque agent possède un avatar et une voix qui lui sont propres, pour une interaction véritablement personnelle."
  },
  {
    icon: Zap,
    title: "Performance Temps Réel",
    description: "Une architecture conçue pour une latence minimale et une fiabilité de niveau entreprise."
  },
  {
    icon: Shield,
    title: "Sécurité Premium",
    description: "Vos données et celles de vos clients sont protégées par un chiffrement de niveau bancaire."
  }
];

const ThalyaDifference = () => {
  return (
    <section className="py-24 px-6 lg:px-8 bg-pure-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            La différence <span className="text-gradient">Thalya</span>
          </h2>
          <p className="text-xl text-graphite-600 max-w-3xl mx-auto">
            Ce qui nous distingue dans l'univers de l'intelligence artificielle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group animate-slide-up p-6 rounded-2xl hover:bg-graphite-50 transition-all duration-300"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-20 h-20 bg-electric-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-electric-blue/20 transition-colors duration-300">
                <feature.icon className="w-10 h-10 text-electric-blue" />
              </div>
              
              <h3 className="text-xl font-bold mb-4 group-hover:text-electric-blue transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-graphite-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive demo section */}
        <div className="mt-20 bg-gradient-to-r from-graphite-900 to-deep-black rounded-3xl p-12 text-center text-pure-white animate-fade-in">
          <h3 className="text-3xl font-bold mb-6">
            Découvrez la magie en action
          </h3>
          <p className="text-xl text-graphite-300 mb-8 max-w-2xl mx-auto">
            Testez notre démo interactive et voyez comment votre future IA pourrait transformer votre business.
          </p>
          <button className="bg-electric-blue hover:bg-blue-600 text-pure-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105">
            Lancer la démo
          </button>
        </div>
      </div>
    </section>
  );
};

export default ThalyaDifference;
