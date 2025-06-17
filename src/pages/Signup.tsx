
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, User, Mail, Phone, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import VoiceOrb from '@/components/ui/VoiceOrb';

interface ConfiguredAI {
  name: string;
  businessType: string;
  personality: string;
  voice: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [configuredAI, setConfiguredAI] = useState<ConfiguredAI | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('thalya_configured_ai');
    if (stored) {
      setConfiguredAI(JSON.parse(stored));
    } else {
      // Redirect back if no configuration found
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store user data and AI configuration
    const signupData = {
      ...formData,
      configuredAI,
      signupDate: new Date().toISOString()
    };
    
    localStorage.setItem('thalya_signup_data', JSON.stringify(signupData));
    
    // Redirect to waiting list
    navigate('/waiting-list');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!configuredAI) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-deep-black mb-4">Configuration non trouvée</h1>
            <p className="text-graphite-600 mb-6">Veuillez d'abord configurer votre IA.</p>
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
        <div className="max-w-4xl mx-auto">
          
          {/* Header with AI Summary */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 mx-auto mb-6">
              <VoiceOrb 
                hue={120} 
                hoverIntensity={0.3}
                forceHoverState={true}
              />
            </div>
            
            <h1 className="text-4xl font-bold text-deep-black mb-4">
              Créer votre compte Thalya
            </h1>
            
            <p className="text-xl text-graphite-600 mb-6">
              Finalisez votre inscription pour utiliser {configuredAI.name} dans votre {configuredAI.businessType}
            </p>

            {/* AI Configuration Summary */}
            <Card className="max-w-md mx-auto bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-sm text-green-600 font-semibold">Votre IA configurée</div>
                  <div className="text-lg font-bold text-green-800">{configuredAI.name}</div>
                  <div className="text-sm text-green-700">
                    Spécialisée pour {configuredAI.businessType}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Signup Form */}
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Informations de contact</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Nom complet</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Téléphone</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>Nom de l'entreprise</span>
                    </Label>
                    <Input
                      id="businessName"
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit"
                    className="w-full bg-electric-blue hover:bg-blue-600 py-4 text-lg rounded-xl"
                    size="lg"
                  >
                    Créer mon compte et utiliser {configuredAI.name}
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;
