
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { useRealtimeOnboarding } from '@/hooks/useRealtimeOnboarding';
import { Button } from '@/components/ui/button';

export function VoiceOnboardingDemo() {
  const { toast } = useToast();
  
  const {
    isConnected,
    isConnecting,
    currentStep,
    currentQuestion,
    onboardingData,
    isSpeaking,
    isUserSpeaking,
    audioLevel,
    startOnboarding,
    endOnboarding
  } = useRealtimeOnboarding();

  const handleOrbClick = () => {
    if (currentStep === 'welcome') {
      startOnboarding();
    }
  };

  const getStatusText = () => {
    switch (currentStep) {
      case 'welcome':
        return 'Cliquez pour commencer votre onboarding vocal';
      case 'questioning':
        return `Question ${currentQuestion + 1}/5 - ${isUserSpeaking ? 'Je vous écoute...' : isSpeaking ? 'Clara vous parle...' : 'Conversation en cours...'}`;
      case 'summary':
        return isUserSpeaking ? 'Je vous écoute...' : isSpeaking ? 'Clara fait le résumé...' : 'Confirmez ou corrigez...';
      case 'generating':
        return 'Génération de votre IA en cours...';
      case 'testing':
        return isUserSpeaking ? 'Testez votre IA...' : isSpeaking ? 'Votre IA vous répond...' : 'Parlez à votre IA pour la tester';
      case 'completed':
        return 'Onboarding terminé !';
      default:
        return '';
    }
  };

  const getOrbProps = () => {
    let hue = 220; // Bleu par défaut
    
    switch (currentStep) {
      case 'welcome':
        hue = 220; // Bleu
        break;
      case 'questioning':
        hue = 280; // Violet
        break;
      case 'summary':
        hue = 320; // Magenta
        break;
      case 'generating':
        hue = 60; // Jaune
        break;
      case 'testing':
        hue = 120; // Vert
        break;
      case 'completed':
        hue = 120; // Vert
        break;
    }

    return {
      hue,
      hoverIntensity: 0.4,
      forceHoverState: isConnected || isConnecting,
      isListening: isUserSpeaking,
      isSpeaking: isSpeaking,
      audioLevel: isUserSpeaking ? audioLevel : (isSpeaking ? 0.7 : 0)
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
      {/* Orb principal */}
      <div 
        className={`w-80 h-80 transition-transform ${currentStep === 'welcome' ? 'cursor-pointer hover:scale-105' : ''}`}
        onClick={handleOrbClick}
      >
        <VoiceOrb {...getOrbProps()} />
      </div>

      {/* Status et contrôles */}
      <div className="text-center space-y-4 max-w-md">
        <p className="text-lg text-graphite-700 font-medium">
          {getStatusText()}
        </p>
        
        {/* Indicateurs de progression pour les questions */}
        {currentStep === 'questioning' && (
          <div className="flex justify-center space-x-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= currentQuestion ? 'bg-electric-blue' : 'bg-graphite-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Indicateur de conversation en cours */}
        {isConnected && (currentStep === 'questioning' || currentStep === 'summary' || currentStep === 'testing') && (
          <div className="flex justify-center items-center space-x-3 mt-6">
            <div className={`w-3 h-3 rounded-full ${isUserSpeaking ? 'bg-electric-blue animate-pulse' : 'bg-gray-300'}`}></div>
            <span className="text-sm text-graphite-600">
              {isUserSpeaking ? 'Vous parlez' : isSpeaking ? 'Clara parle' : 'En écoute'}
            </span>
            <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          </div>
        )}

        {/* Bouton recommencer */}
        {isConnected && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={endOnboarding}
              variant="outline"
              size="sm"
            >
              Recommencer
            </Button>
          </div>
        )}

        {/* Affichage des données collectées (debug) */}
        {process.env.NODE_ENV === 'development' && Object.keys(onboardingData).length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left text-sm">
            <h4 className="font-semibold mb-2">Données collectées :</h4>
            <pre className="text-xs">{JSON.stringify(onboardingData, null, 2)}</pre>
          </div>
        )}

        {/* État de génération */}
        {currentStep === 'generating' && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-electric-blue"></div>
            <span className="text-electric-blue font-medium">Génération en cours...</span>
          </div>
        )}

        {/* Message de test */}
        {currentStep === 'testing' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-green-800 text-sm">
              🎉 Votre IA personnalisée est prête ! Parlez-lui naturellement pour la tester.
            </p>
          </div>
        )}

        {/* Instructions pour la conversation */}
        {isConnected && currentStep !== 'generating' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-blue-800 text-xs">
              💡 Parlez naturellement, Clara détecte automatiquement quand vous commencez et arrêtez de parler
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
