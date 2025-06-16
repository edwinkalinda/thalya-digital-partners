
import { Phone, Brain, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import { GoogleGenAILiveChat } from "@/components/voice/GoogleGenAILiveChat";
import { RealtimeVoiceChat } from "@/components/voice/RealtimeVoiceChat";
import { ConversationInterface } from "@/components/voice/ConversationInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VoiceManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-12 h-12 text-electric-blue mr-4" />
              <h1 className="text-4xl font-bold text-deep-black">
                Clara - Gestion Vocale IA
              </h1>
            </div>
            <p className="text-xl text-graphite-600 max-w-3xl mx-auto">
              Interface complète de chat vocal avec Google Gemini, OpenAI Realtime et conversation temps réel
            </p>
          </div>

          {/* Onglets pour les différentes interfaces */}
          <Tabs defaultValue="genai" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="genai">Google GenAI Live</TabsTrigger>
              <TabsTrigger value="realtime">WebSocket Gemini</TabsTrigger>
              <TabsTrigger value="conversation">OpenAI Realtime</TabsTrigger>
            </TabsList>

            <TabsContent value="genai" className="space-y-8">
              <GoogleGenAILiveChat />
            </TabsContent>

            <TabsContent value="realtime" className="space-y-8">
              <RealtimeVoiceChat />
            </TabsContent>

            <TabsContent value="conversation" className="space-y-8">
              <ConversationInterface />
            </TabsContent>
          </Tabs>

          {/* Informations sur les capacités */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-electric-blue/20 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Google GenAI Live
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">
                  API native Google GenAI avec traitement audio direct via Supabase Edge Functions sécurisées.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  WebSocket Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  Communication bidirectionnelle avec Gemini via WebSocket pour latence minimale.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  OpenAI Realtime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700">
                  Interface de conversation avancée avec gestion audio optimisée et reconnexion automatique.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Instructions d'utilisation */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-800">
                🎯 Utilisation des interfaces vocales Clara
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-800">Google GenAI Live</h4>
                  <ul className="text-indigo-600 space-y-1">
                    <li>• Chat texte sécurisé</li>
                    <li>• Réponses Gemini Flash</li>
                    <li>• Tests intégrés</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">WebSocket Gemini</h4>
                  <ul className="text-green-600 space-y-1">
                    <li>• Audio temps réel</li>
                    <li>• Latence ultra-faible</li>
                    <li>• Statistiques live</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-800">OpenAI Realtime</h4>
                  <ul className="text-purple-600 space-y-1">
                    <li>• Conversation fluide</li>
                    <li>• Reconnexion auto</li>
                    <li>• Gestion d'erreurs</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">⚠️ Configuration requise :</p>
                <p className="text-xs text-amber-700 mt-1">
                  Clés API configurées dans les secrets Supabase : GOOGLE_GENAI_API_KEY, OPENAI_API_KEY, ELEVENLABS_API_KEY
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
