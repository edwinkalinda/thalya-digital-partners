
import { Phone, Brain, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { GoogleGenAILiveChat } from "@/components/voice/GoogleGenAILiveChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VoiceManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-12 h-12 text-electric-blue mr-4" />
              <h1 className="text-4xl font-bold text-deep-black">
                Clara - Google GenAI Live
              </h1>
            </div>
            <p className="text-xl text-graphite-600 max-w-2xl mx-auto">
              Nouvelle génération de chat vocal avec Google Gemini 2.0 Flash Live - Audio natif temps réel
            </p>
          </div>

          {/* Interface de chat vocal Google GenAI */}
          <GoogleGenAILiveChat />

          {/* Informations sur les capacités */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-electric-blue/20 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Gemini 2.0 Flash Live
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">
                  API native Google GenAI avec traitement audio direct sans transcription intermédiaire.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Latence Ultra-Faible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  Communication audio bidirectionnelle en temps réel avec latence minimale native.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Multimodal Natif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700">
                  Traitement simultané audio et texte avec voix synthétique naturelle intégrée.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Instructions d'utilisation */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-800">
                🎯 Comment utiliser Clara avec Google GenAI Live
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">1</span>
                  <div>
                    <p className="font-medium text-indigo-800">Configuration</p>
                    <p className="text-indigo-600">Ajoutez VITE_GOOGLE_GENAI_API_KEY dans votre fichier .env</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">2</span>
                  <div>
                    <p className="font-medium text-indigo-800">Connexion Native</p>
                    <p className="text-indigo-600">Connexion directe à l'API Gemini 2.0 Flash Live</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">3</span>
                  <div>
                    <p className="font-medium text-indigo-800">Audio Direct</p>
                    <p className="text-indigo-600">Parlez directement sans transcription intermédiaire</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">4</span>
                  <div>
                    <p className="font-medium text-indigo-800">Réponses Instantanées</p>
                    <p className="text-indigo-600">Clara répond en audio natif avec latence minimale</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">⚠️ Configuration requise :</p>
                <p className="text-xs text-amber-700 mt-1">
                  Clé API Google GenAI avec accès à Gemini 2.0 Flash Live (version expérimentale)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceManagement;
