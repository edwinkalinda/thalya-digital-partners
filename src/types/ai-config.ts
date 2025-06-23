
export interface AIConfig {
  id: string;
  name: string;
  businessId: string;
  businessName: string;
  businessType: string;
  personality: string;
  tone: string;
  language: string;
  promptTemplate: string;
  voiceSettings: {
    speed: string;
    pitch: string;
    stability: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}
