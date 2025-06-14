
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
    
    // Utilise un compte de test pré-configuré
    const testEmail = "test@thalya.dev";
    const testPassword = "testpassword123";
    
    try {
      // Tente d'abord de se connecter
      const { error: signInError } = await signIn(testEmail, testPassword);
      
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // Si la connexion échoue, crée le compte de test
        await signUp(testEmail, testPassword, "Test", "User");
        
        // Puis tente de se connecter à nouveau
        setTimeout(async () => {
          const { error: retryError } = await signIn(testEmail, testPassword);
          if (!retryError) {
            navigate('/dashboard');
          }
        }, 1000);
      } else if (!signInError) {
        navigate('/dashboard');
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
