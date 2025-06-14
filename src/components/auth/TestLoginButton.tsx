
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
    
    // Utilise un compte de test avec un email plus standard
    const testEmail = "test.thalya@gmail.com";
    const testPassword = "testpassword123";
    
    try {
      console.log('Tentative de connexion avec:', testEmail);
      
      // Tente d'abord de se connecter
      const { error: signInError } = await signIn(testEmail, testPassword);
      
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log('Compte non trouvé, création du compte de test...');
        
        // Crée le compte directement avec Supabase sans confirmation d'email
        const { data, error: signUpError } = await supabase.auth.signUp({
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
        } else {
          console.log('Compte créé avec succès:', data);
          
          // Si le compte est créé avec succès, tente une connexion immédiate
          if (data.user && !data.user.email_confirmed_at) {
            console.log('Tentative de connexion malgré email non confirmé...');
            
            // Essaie de forcer la connexion avec signInWithPassword
            const { data: sessionData, error: forceSignInError } = await supabase.auth.signInWithPassword({
              email: testEmail,
              password: testPassword,
            });
            
            if (!forceSignInError && sessionData.session) {
              console.log('Connexion forcée réussie!');
              navigate('/dashboard');
            } else {
              console.log('Connexion forcée échouée, redirection vers message d\'information');
              // Affiche un message explicatif à l'utilisateur
              alert('Le compte de test a été créé mais nécessite une confirmation par email. Veuillez vérifier votre boîte email ou utiliser un compte existant.');
            }
          } else {
            console.log('Connexion automatique après création du compte');
            navigate('/dashboard');
          }
        }
      } else if (!signInError) {
        console.log('Connexion directe réussie!');
        navigate('/dashboard');
      } else if (signInError.message.includes('Email not confirmed')) {
        console.log('Email non confirmé, affichage du message d\'information');
        alert('Le compte existe mais l\'email n\'est pas confirmé. Veuillez vérifier votre boîte email ou contacter le support.');
      } else {
        console.error('Erreur de connexion:', signInError);
        alert(`Erreur de connexion: ${signInError.message}`);
      }
    } catch (error) {
      console.error('Test login error:', error);
      alert('Une erreur inattendue s\'est produite lors de la connexion de test.');
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
