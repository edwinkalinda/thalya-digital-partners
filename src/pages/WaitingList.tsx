
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Sparkles, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import VoiceOrb from '@/components/ui/VoiceOrb';

interface SignupData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  configuredAI: {
    name: string;
    businessType: string;
    personality: string;
    voice: string;
  };
  signupDate: string;
}

const WaitingList = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState<SignupData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('thalya_signup_data');
    if (stored) {
      setSignupData(JSON.parse(stored));
    } else {
      // Redirect if no signup data found
      navigate('/');
    }
  }, [navigate]);

  if (!signupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-deep-black mb-4">Données d'inscription non trouvées</h1>
            <Button onClick={() => navigate('/')} className="bg-electric-blue hover:bg-blue-600">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Success Animation */}
          <div className="mb-12">
            <div className="w-48 h-48 mx-auto mb-8 relative">
              <VoiceOrb 
                hue={120} 
                hoverIntensity={0.4}
                forceHoverState={true}
              />
              <div className="absolute top-4 right-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Inscription réussie !
              </div>
              
              <h1 className="text-5xl font-bold text-deep-black mb-4">
                Merci d'avoir choisi Thalya
              </h1>
              
              <p className="text-2xl text-graphite-600 max-w-3xl mx-auto leading-relaxed">
                Bonjour {signupData.name} ! Votre IA <span className="font-semibold text-electric-blue">{signupData.configuredAI.name}</span> 
                pour {signupData.businessName} sera bientôt prête.
              </p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-green-50 border-green-200 shadow-lg">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Configuration sauvegardée</h3>
                <p className="text-green-600 text-sm">
                  {signupData.configuredAI.name} est configurée pour votre {signupData.configuredAI.businessType}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 shadow-lg">
              <CardContent className="pt-6 text-center">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-800 mb-2">En cours de préparation</h3>
                <p className="text-blue-600 text-sm">
                  Notre équipe prépare votre infrastructure Thalya personnalisée
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200 shadow-lg">
              <CardContent className="pt-6 text-center">
                <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Bientôt disponible</h3>
                <p className="text-purple-600 text-sm">
                  Vous recevrez un email dès que votre IA sera opérationnelle
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="max-w-2xl mx-auto shadow-xl mb-8">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold text-deep-black mb-6">Prochaines étapes</h2>
              
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-deep-black">Configuration technique</h3>
                    <p className="text-graphite-600 text-sm">Nous préparons votre infrastructure Thalya avec {signupData.configuredAI.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-deep-black">Intégration Twilio</h3>
                    <p className="text-graphite-600 text-sm">Configuration des appels téléphoniques pour votre {signupData.configuredAI.businessType}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-electric-blue rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-deep-black">Activation et formation</h3>
                    <p className="text-graphite-600 text-sm">Réception de vos accès et formation sur l'utilisation de Thalya</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-electric-blue/10 to-purple-600/10 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-deep-black mb-4">Nous vous contacterons bientôt</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Email :</span> {signupData.email}
              </div>
              <div>
                <span className="font-semibold">Téléphone :</span> {signupData.phone}
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white px-8 py-3 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
