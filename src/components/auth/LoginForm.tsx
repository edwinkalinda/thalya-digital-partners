
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string; rememberMe: boolean }) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Adresse email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white"
            placeholder="votre@email.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-slate-700">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-14 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-white"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary focus:ring-2"
          />
          <span className="ml-3 text-sm text-slate-600 font-medium">Se souvenir de moi</span>
        </label>
        
        <a href="#" className="text-sm text-primary hover:text-primary/80 font-medium">
          Mot de passe oublié ?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 text-base font-bold"
        variant="premium"
      >
        {isLoading ? (
          'Connexion en cours...'
        ) : (
          <>
            Se connecter
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
