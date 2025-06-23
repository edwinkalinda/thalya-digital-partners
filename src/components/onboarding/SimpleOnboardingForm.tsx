
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { Bot, Building, User, MessageSquare } from 'lucide-react';

const SimpleOnboardingForm = () => {
  const navigate = useNavigate();
  const { saveConfiguration, isLoading } = useAIConfiguration();
  
  const [formData, setFormData] = useState({
    email: '',
    business_name: '',
    business_type: '',
    ai_name: 'Clara',
    tone: 'professionnel',
    description: ''
  });

  const businessTypes = [
    'Restaurant',
    'Hôtel',
    'Clinique',
    'Cabinet dentaire',
    'Salon de coiffure',
    'Agence immobilière',
    'Commerce de détail',
    'Service client',
    'Autre'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.business_name || !formData.business_type) {
      return;
    }

    const result = await saveConfiguration({
      email: formData.email,
      business_name: formData.business_name,
      ai_name: formData.ai_name,
      business_type: formData.business_type,
      status: 'active'
    });

    if (result.success) {
      navigate('/client-dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Configurez votre IA Clara
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Quelques informations pour personnaliser votre assistante virtuelle
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2" />
                Email professionnel
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_name" className="flex items-center text-gray-700">
                <Building className="w-4 h-4 mr-2" />
                Nom de votre entreprise
              </Label>
              <Input
                id="business_name"
                placeholder="Mon Restaurant"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type" className="text-gray-700">
                Type d'entreprise
              </Label>
              <Select
                value={formData.business_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, business_type: value }))}
                required
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Sélectionnez votre secteur" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai_name" className="flex items-center text-gray-700">
                <Bot className="w-4 h-4 mr-2" />
                Nom de votre IA
              </Label>
              <Input
                id="ai_name"
                placeholder="Clara"
                value={formData.ai_name}
                onChange={(e) => setFormData(prev => ({ ...prev, ai_name: e.target.value }))}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center text-gray-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comment voulez-vous que votre IA aide vos clients ?
              </Label>
              <Textarea
                id="description"
                placeholder="Prendre des réservations, répondre aux questions, accueillir les clients..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Configuration en cours...
                </>
              ) : (
                'Créer mon IA Clara'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleOnboardingForm;
