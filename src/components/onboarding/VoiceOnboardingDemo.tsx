
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { useRealtimeOnboarding } from '@/hooks/useRealtimeOnboarding';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { useNavigate } from 'react-router-dom';

export const VoiceOnboardingDemo = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [collectedData, setCollectedData] = useState<any>({});
  const { saveConfiguration, loading: saveLoading } = useAIConfiguration();

  const {
    isConnected,
    isRecording,
    currentTranscript,
    aiResponse,
    audioLevel,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    messages
  } = useRealtimeOnboarding();

  const handleStartOnboarding = async () => {
    if (!email) return;
    setEmailSubmitted(true);
    await connect();
  };

  const handleCompleteOnboarding = async () => {
    if (!email || !collectedData.business_name || !collectedData.business_type) return;

    const config = {
      email,
      business_name: collectedData.business_name,
      ai_name: collectedData.ai_name || 'Clara',
      business_type: collectedData.business_type,
      profession: collectedData.profession,
      needs: collectedData.needs,
      tone: collectedData.tone || 'professionnel',
      language: collectedData.language || 'français',
      use_case: collectedData.use_case
    };

    const result = await saveConfiguration(config);
    
    if (result.success) {
      setOnboardingComplete(true);
      // Sauvegarder dans localStorage pour le dashboard
      localStorage.setItem('thalya_configured_ai', JSON.stringify({
        name: config.ai_name,
        businessType: config.business_type,
        personality: config.tone,
        voice: 'Clara'
      }));
      
      setTimeout(() => {
        navigate('/signup');
      }, 2000);
    }
  };

  // Analyser les messages pour extraire les données
  useEffect(() => {
    const lastAiMessage = messages.filter(m => m.role === 'assistant').pop();
    if (lastAiMessage && lastAiMessage.content) {
      // Logique simple d'extraction de données depuis la conversation
      const content = lastAiMessage.content.toLowerCase();
      
      if (content.includes('restaurant') && !collectedData.business_type) {
        setCollectedData(prev => ({ ...prev, business_type: 'Restaurant' }));
      } else if (content.includes('clinique') || content.includes('médical')) {
        setCollectedData(prev => ({ ...prev, business_type: 'Clinique médicale' }));
      } else if (content.includes('hôtel') || content.includes('hébergement')) {
        setCollectedData(prev => ({ ...prev, business_type: 'Hôtellerie' }));
      }
      
      // Vérifier si on a assez de données pour terminer
      if (messages.length >= 8 && collectedData.business_type) {
        setCollectedData(prev => ({
          ...prev,
          business_name: prev.business_name || 'Mon Entreprise',
          ai_name: 'Clara',
          tone: 'professionnel et bienveillant',
          language: 'français',
          use_case: 'Accueil téléphonique et prise de rendez-vous'
        }));
      }
    }
  }, [messages, collectedData]);

  if (onboardingComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-deep-black mb-4">
            🎉 Configuration terminée !
          </h2>
          <p className="text-graphite-600 mb-6">
            Votre IA Clara est maintenant configurée selon vos besoins. 
            Vous allez être redirigé vers la création de votre compte.
          </p>
          <div className="animate-pulse text-electric-blue font-medium">
            Redirection en cours...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!emailSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-deep-black mb-4">
              Configurons votre IA Clara
            </h2>
            <p className="text-graphite-600 mb-6">
              Entrez votre email pour commencer la configuration vocale de votre assistante IA.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="mt-1"
              />
            </div>
            
            <Button 
              onClick={handleStartOnboarding}
              disabled={!email || !email.includes('@')}
              className="w-full bg-electric-blue hover:bg-blue-600 py-3"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Commencer la configuration vocale
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Statut de connexion */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">
                {isConnected ? 'Connecté à Clara' : 'Connexion...'}
              </span>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'En ligne' : 'Hors ligne'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Interface de conversation */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="h-96">
          <CardContent className="pt-6 h-full flex flex-col">
            <h3 className="font-semibold mb-4">Conversation avec Clara</h3>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-electric-blue text-white ml-8'
                      : 'bg-gray-100 text-gray-800 mr-8'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.role === 'user' ? 'Vous' : 'Clara'}
                  </div>
                  <div>{message.content}</div>
                </div>
              ))}
              
              {currentTranscript && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 ml-8">
                  <div className="text-sm font-medium mb-1 text-blue-800">Vous (en cours...)</div>
                  <div className="text-blue-700">{currentTranscript}</div>
                </div>
              )}
              
              {aiResponse && (
                <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 mr-8">
                  <div className="text-sm font-medium mb-1 text-purple-800">Clara</div>
                  <div className="text-purple-700">{aiResponse}</div>
                </div>
              )}
            </div>

            {/* Contrôles audio */}
            <div className="flex items-center justify-center space-x-4 pt-4 border-t">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isConnected}
                className={`${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-electric-blue hover:bg-blue-600'
                } text-white px-6 py-3 rounded-full`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Parler
                  </>
                )}
              </Button>
              
              {audioLevel > 0 && (
                <div className="flex items-center space-x-1">
                  <Volume2 className="w-4 h-4 text-gray-500" />
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-electric-blue h-2 rounded-full transition-all duration-150" 
                      style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Données collectées */}
        <Card className="h-96">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Configuration en cours</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="font-medium">{email}</p>
              </div>
              
              {collectedData.business_type && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Type d'entreprise</label>
                  <p className="font-medium">{collectedData.business_type}</p>
                </div>
              )}
              
              {collectedData.business_name && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom de l'entreprise</label>
                  <p className="font-medium">{collectedData.business_name}</p>
                </div>
              )}
              
              {collectedData.tone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Ton de voix</label>
                  <p className="font-medium">{collectedData.tone}</p>
                </div>
              )}
            </div>

            {/* Bouton de finalisation */}
            {Object.keys(collectedData).length >= 3 && (
              <div className="mt-6 pt-4 border-t">
                <Button 
                  onClick={handleCompleteOnboarding}
                  disabled={saveLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {saveLoading ? (
                    'Sauvegarde...'
                  ) : (
                    <>
                      Finaliser la configuration
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
