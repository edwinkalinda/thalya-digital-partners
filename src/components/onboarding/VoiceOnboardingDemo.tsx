
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import VoiceOrb from '@/components/ui/VoiceOrb';
import { useVoiceOnboarding } from '@/hooks/useVoiceOnboarding';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

export function VoiceOnboardingDemo() {
  const { toast } = useToast();
  
  const {
    isConnected,
    isConnecting,
    currentStep,
    currentQuestion,
    onboardingData,
    isRecording,
    isSpeaking,
    audioLevel,
    startOnboarding,
    endOnboarding,
    startRecording,
    stopRecording
  } = useVoiceOnboarding();

  const handleOrbClick = () => {
    if (currentStep === 'welcome') {
      startOnboarding();
    } else if (currentStep === 'questioning' || currentStep === 'summary' || currentStep === 'testing') {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const getStatusText = () => {
    switch (currentStep) {
      case 'welcome':
        return 'Cliquez pour commencer votre onboarding vocal';
      case 'questioning':
        return `Question ${currentQuestion + 1}/5 - ${isRecording ? 'Parlez maintenant...' : 'Cliquez pour répondre'}`;
      case 'summary':
        return isRecording ? 'Confirmez par "oui" ou corrigez...' : 'Cliquez pour confirmer';
      case 'generating':
        return 'Génération de votre IA en cours...';
      case 'testing':
        return isRecording ? 'Testez votre IA...' : 'Cliquez pour tester votre IA';
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
      isListening: isRecording,
      isSpeaking: isSpeaking,
      audioLevel: audioLevel
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
      {/* Orb principal */}
      <div 
        className="w-80 h-80 cursor-pointer transition-transform hover:scale-105"
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

        {/* Contrôles manuels pendant l'onboarding */}
        {isConnected && (currentStep === 'questioning' || currentStep === 'summary' || currentStep === 'testing') && (
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="sm"
              className="flex items-center space-x-2"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? 'Arrêter' : 'Parler'}</span>
            </Button>
            
            {currentStep !== 'welcome' && (
              <Button
                onClick={endOnboarding}
                variant="outline"
                size="sm"
              >
                Recommencer
              </Button>
            )}
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
              🎉 Votre IA personnalisée est prête ! Vous pouvez maintenant lui parler pour la tester.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
