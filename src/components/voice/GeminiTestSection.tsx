
import { Button } from "@/components/ui/button";
import { TestTube, Zap } from "lucide-react";
import { GeminiTest } from "@/types/voice";

interface GeminiTestSectionProps {
  isConnected: boolean;
  onRunTest: (test: GeminiTest) => void;
}

export const GeminiTestSection = ({ isConnected, onRunTest }: GeminiTestSectionProps) => {
  const geminiApiTests: GeminiTest[] = [
    { 
      name: "🤝 Connexion", 
      message: "Réponds juste 'Bonjour' pour tester la connexion Gemini.",
      description: "Test de base de connexion",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    { 
      name: "🧮 Calcul", 
      message: "Combien font 25 + 17 ? Réponds juste avec le nombre.",
      description: "Test de capacité de calcul",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    { 
      name: "🇫🇷 Français", 
      message: "Dis-moi bonjour en français de manière naturelle.",
      description: "Test de langue française",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    },
    { 
      name: "🧠 Logique", 
      message: "Si tous les oiseaux volent et qu'un rouge-gorge est un oiseau, que peux-tu dire du rouge-gorge ?",
      description: "Test de raisonnement logique",
      color: "bg-orange-50 border-orange-200 text-orange-800"
    },
    { 
      name: "💡 Créativité", 
      message: "Invente une phrase poétique avec les mots : intelligence, avenir, technologie.",
      description: "Test de créativité",
      color: "bg-pink-50 border-pink-200 text-pink-800"
    },
    { 
      name: "📅 Contexte", 
      message: "Quelle est la date d'aujourd'hui et dans quel contexte es-tu utilisé ?",
      description: "Test de conscience contextuelle",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-purple-800 flex items-center justify-center mb-2">
          <TestTube className="w-5 h-5 mr-2" />
          🧪 Tests API Google Gemini 1.5 Flash
        </h2>
        <p className="text-sm text-purple-600">
          Testez différents aspects de l'intelligence artificielle Clara
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {geminiApiTests.map((test, index) => (
          <Button
            key={index}
            onClick={() => onRunTest(test)}
            disabled={!isConnected}
            variant="outline"
            className={`h-auto p-4 text-left flex flex-col items-start space-y-2 ${test.color} hover:scale-105 transition-transform`}
          >
            <div className="font-semibold text-sm">{test.name}</div>
            <div className="text-xs opacity-80 line-clamp-2">{test.description}</div>
            <div className="text-xs opacity-60 truncate w-full">{test.message.substring(0, 40)}...</div>
          </Button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center px-3 py-1 bg-white/70 rounded-full text-xs text-purple-700">
          <Zap className="w-3 h-3 mr-1" />
          Tests optimisés pour Google Gemini 1.5 Flash
        </div>
      </div>
    </div>
  );
};
