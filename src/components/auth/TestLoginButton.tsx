
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function TestLoginButton() {
  const { signIn } = useAuth();

  const handleTestLogin = async () => {
    await signIn('test@example.com', 'password123');
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
    </div>
  );
}
