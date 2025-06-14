
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2, TestTube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const TestLoginButton: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTestLogin = async () => {
    setIsLoading(true);
    
    // Utilise un nouvel email de test avec timestamp pour éviter les conflits
    const testEmail = `test${Date.now()}@thalya.app`;
    const testPassword = "testpassword123";
    
    try {
      console.log('Création et connexion avec un nouveau compte de test:', testEmail);
      
      // Crée directement un nouveau compte sans confirmation d'email
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: "Test",
            last_name: "User",
          },
        },
      });
      
      if (signUpError) {
        console.error('Erreur lors de la création du compte:', signUpError);
        alert(`Erreur lors de la création du compte de test: ${signUpError.message}`);
        return;
      }
      
      console.log('Compte créé avec succès:', signUpData);
      
      // Si le compte est créé et que l'utilisateur est automatiquement connecté
      if (signUpData.session) {
        console.log('Connexion automatique réussie!');
        navigate('/dashboard');
        return;
      }
      
      // Sinon, tente une connexion manuelle
      console.log('Tentative de connexion manuelle...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError) {
        console.error('Erreur de connexion:', signInError);
        alert(`Erreur de connexion: ${signInError.message}`);
      } else if (signInData.session) {
        console.log('Connexion manuelle réussie!');
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Erreur inattendue:', error);
      alert('Une erreur inattendue s\'est produite lors de la connexion de test.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 mt-6">
      <p className="text-xs text-gray-500 text-center mb-3">
        Pour tester rapidement le système (génère un nouveau compte) :
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
            Création compte test...
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
