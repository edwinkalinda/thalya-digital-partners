
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2, TestTube } from "lucide-react";

export const TestLoginButton: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTestLogin = async () => {
    setIsLoading(true);
    
    // Utilise un compte de test avec un email plus standard
    const testEmail = "test.thalya@gmail.com";
    const testPassword = "testpassword123";
    
    try {
      console.log('Tentative de connexion avec:', testEmail);
      
      // Tente d'abord de se connecter
      const { error: signInError } = await signIn(testEmail, testPassword);
      
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log('Compte non trouvé, création du compte de test...');
        
        // Si la connexion échoue, crée le compte de test
        const { error: signUpError } = await signUp(testEmail, testPassword, "Test", "User");
        
        if (signUpError) {
          console.error('Erreur lors de la création du compte:', signUpError);
        } else {
          console.log('Compte créé, tentative de connexion...');
          
          // Puis tente de se connecter à nouveau après un délai
          setTimeout(async () => {
            const { error: retryError } = await signIn(testEmail, testPassword);
            if (!retryError) {
              console.log('Connexion réussie!');
              navigate('/dashboard');
            } else {
              console.error('Erreur lors de la reconnexion:', retryError);
            }
            setIsLoading(false);
          }, 2000);
          return; // Sort de la fonction pour éviter de définir isLoading à false
        }
      } else if (!signInError) {
        console.log('Connexion directe réussie!');
        navigate('/dashboard');
      } else {
        console.error('Erreur de connexion:', signInError);
      }
    } catch (error) {
      console.error('Test login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-6">
      <p className="text-xs text-gray-500 text-center mb-3">
        Pour tester rapidement le système vocal :
      </p>
      <Button
        onClick={handleTestLogin}
        disabled={isLoading}
        variant="outline"
        className="w-full h-10 border-orange-200 text-orange-700 hover:bg-orange-50"
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Connexion test...
          </div>
        ) : (
          <div className="flex items-center">
            <TestTube className="w-4 h-4 mr-2" />
            Connexion de test
          </div>
        )}
      </Button>
    </div>
  );
};
