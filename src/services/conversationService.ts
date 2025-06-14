
interface ConversationMessage {
  role: 'user' | 'ai';
  message: string;
  timestamp: number;
}

interface ConversationResponse {
  message: string;
  shouldProceedToNext: boolean;
  extractedData?: Record<string, any>;
}

interface OnboardingData {
  name: string;
  personality: string;
  mission: string;
  voice: string;
  info: string;
}

class ConversationService {
  private isRealTimeEnabled = false;
  private websocket: WebSocket | null = null;
  private onMessageCallback: ((response: ConversationResponse) => void) | null = null;

  // Future: Enable real-time conversation with backend
  enableRealTime(wsUrl: string, onMessage: (response: ConversationResponse) => void) {
    this.isRealTimeEnabled = true;
    this.onMessageCallback = onMessage;
    
    this.websocket = new WebSocket(wsUrl);
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
  }

  // Current: Simulated conversation logic
  async processMessage(
    userMessage: string, 
    currentStep: number, 
    onboardingData: Partial<OnboardingData>
  ): Promise<ConversationResponse> {
    
    if (this.isRealTimeEnabled && this.websocket) {
      // Future: Send to real backend
      this.websocket.send(JSON.stringify({
        message: userMessage,
        step: currentStep,
        context: onboardingData
      }));
      
      // Return immediately, response will come via WebSocket
      return { message: '', shouldProceedToNext: false };
    }

    // Current: Simulated logic
    return this.simulateConversation(userMessage, currentStep, onboardingData);
  }

  private simulateConversation(
    userMessage: string, 
    currentStep: number, 
    onboardingData: Partial<OnboardingData>
  ): ConversationResponse {
    const stepKeys = ['name', 'personality', 'mission', 'voice', 'info'];
    const extractedData = { [stepKeys[currentStep]]: userMessage };

    let message = '';
    let shouldProceedToNext = true;

    switch (currentStep) {
      case 0:
        message = `Parfait ! ${userMessage} est un excellent nom. Maintenant, décrivez-moi la personnalité que vous souhaitez pour ${userMessage}. Doit-elle être formelle, amicale, professionnelle, décontractée ?`;
        break;
      case 1:
        message = "Excellent choix ! Maintenant, quelle sera la mission principale de votre IA ? Par exemple : accueillir les clients, prendre des rendez-vous, fournir des informations sur vos services...";
        break;
      case 2:
        message = "Parfait ! Quel ton de voix préférez-vous ? Plutôt chaleureux et empathique, ou professionnel et efficace ?";
        break;
      case 3:
        message = "Merci ! Pour finir, quelles sont les informations clés que votre IA doit connaître sur votre entreprise ? (horaires, services, tarifs...)";
        break;
      case 4:
        message = "Fantastique ! Votre IA est maintenant configurée. Je vais générer sa personnalité et vous pourrez la tester dans quelques instants.";
        shouldProceedToNext = false; // Last step
        break;
      default:
        message = "Merci pour ces informations !";
    }

    return { message, shouldProceedToNext, extractedData };
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.isRealTimeEnabled = false;
    this.onMessageCallback = null;
  }
}

export const conversationService = new ConversationService();
export type { ConversationMessage, ConversationResponse, OnboardingData };
