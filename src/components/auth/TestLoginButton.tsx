
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function TestLoginButton() {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleTestLogin = async () => {
    try {
      // Essayer d'abord de se connecter
      await signIn('test@example.com', 'password123');
    } catch (error: any) {
      if (error.message?.includes('Invalid login credentials')) {
        try {
          // Si les identifiants sont invalides, créer le compte test
          await signUp('test@example.com', 'password123', 'Test', 'User');
          toast({
            title: "Compte test créé",
            description: "Un compte test a été créé. Vérifiez votre email pour confirmer.",
          });
        } catch (signUpError: any) {
          toast({
            title: "Erreur",
            description: "Impossible de créer le compte test. Veuillez créer un compte manuellement.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive"
        });
      }
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
