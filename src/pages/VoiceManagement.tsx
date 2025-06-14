
import { Phone, Brain, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { RealtimeVoiceChat } from "@/components/voice/RealtimeVoiceChat";
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
                Chat Vocal Intelligent Clara
              </h1>
            </div>
            <p className="text-xl text-graphite-600 max-w-2xl mx-auto">
              Conversez naturellement avec Clara, votre assistante IA vocale propulsée par Google Gemini 1.5 Flash
            </p>
          </div>

          {/* Interface de chat vocal principale */}
          <RealtimeVoiceChat />

          {/* Informations sur les capacités */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-electric-blue/20 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Intelligence Avancée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">
                  Clara utilise Google Gemini 1.5 Flash pour des conversations naturelles et intelligentes en français.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Traitement Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  Latence optimisée avec OpenAI Whisper, Gemini 1.5 Flash et ElevenLabs ultra-rapides.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Voix Naturelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700">
                  Synthèse vocale ElevenLabs avec voix française Lily naturelle et expressive.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Instructions d'utilisation */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-800">
                🎯 Comment utiliser Clara
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">1</span>
                  <div>
                    <p className="font-medium text-indigo-800">Connectez-vous</p>
                    <p className="text-indigo-600">Cliquez sur "Se connecter" pour établir la connexion avec Gemini 1.5 Flash</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">2</span>
                  <div>
                    <p className="font-medium text-indigo-800">Testez rapidement</p>
                    <p className="text-indigo-600">Utilisez les boutons de test pour vérifier les capacités de Clara</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">3</span>
                  <div>
                    <p className="font-medium text-indigo-800">Parlez ou écrivez</p>
                    <p className="text-indigo-600">Utilisez le micro pour parler ou tapez votre message</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center font-semibold text-xs">4</span>
                  <div>
                    <p className="font-medium text-indigo-800">Écoutez Clara</p>
                    <p className="text-indigo-600">Clara vous répond avec sa voix naturelle et ses analyses intelligentes</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">⚠️ Configuration requise :</p>
                <p className="text-xs text-amber-700 mt-1">
                  Assurez-vous que les clés API sont configurées dans les secrets Supabase : GOOGLE_GEMINI_API_KEY, ELEVENLABS_API_KEY, OPENAI_API_KEY
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
