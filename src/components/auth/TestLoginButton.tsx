
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function TestLoginButton() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleTestLogin = async () => {
    try {
      // Essayer d'abord de se connecter
      const { error: signInError } = await signIn('test@example.com', 'password123');
      
      if (!signInError) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté avec le compte test.",
        });
        return;
      }

      if (signInError.message?.includes('Invalid login credentials')) {
        try {
          // Si les identifiants sont invalides, créer le compte test
          const { error: signUpError } = await signUp('test@example.com', 'password123', 'Test', 'User');
          
          if (!signUpError) {
            toast({
              title: "Compte test créé",
              description: "Un compte test a été créé. Vérifiez votre email pour confirmer.",
            });
          } else {
            throw signUpError;
          }
        } catch (signUpError: any) {
          console.error('Sign up error:', signUpError);
          toast({
            title: "Erreur lors de la création",
            description: signUpError.message || "Impossible de créer le compte test.",
            variant: "destructive"
          });
        }
      } else {
        throw signInError;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur inattendue s'est produite.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-graphite-200">
      <p className="text-xs text-center text-graphite-500 mb-3">
        Mode développement
      </p>
      <Button 
        onClick={handleTestLogin}
        variant="outline"
        className="w-full text-sm"
      >
        Connexion test
      </Button>
      <p className="text-xs text-center text-graphite-400 mt-2">
        Créera un compte test si nécessaire
      </p>
    </div>
  );
}
