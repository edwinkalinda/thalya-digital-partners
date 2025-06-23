
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { TestLoginButton } from "@/components/auth/TestLoginButton";
import { useAuth } from "@/hooks/useAuth";

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState<string | undefined>();
  const [registerError, setRegisterError] = useState<string | undefined>();
  const navigate = useNavigate();
  const { signIn, signUp, user, isLoading } = useAuth();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/client-dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    setLoginError(undefined);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        setLoginError('Email ou mot de passe incorrect');
      } else {
        navigate('/client-dashboard');
      }
    } catch (err) {
      setLoginError('Une erreur inattendue s\'est produite');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setRegisterError(undefined);
    
    if (data.password !== data.confirmPassword) {
      setRegisterError('Les mots de passe ne correspondent pas');
      return;
    }

    const [firstName, ...lastNameParts] = data.name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    try {
      const { error } = await signUp(data.email, data.password, firstName, lastName);
      
      if (error) {
        setRegisterError(error.message === 'User already registered' 
          ? 'Cet email est déjà utilisé' 
          : 'Erreur lors de l\'inscription');
      } else {
        setActiveTab("login");
      }
    } catch (err) {
      setRegisterError('Une erreur inattendue s\'est produite');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-all duration-300 group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Retour à l'accueil
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>

            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Connexion à Thalya
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Votre plateforme d'IA conversationnelle d'entreprise
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="login" 
                  className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="text-sm font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Inscription
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <LoginForm 
                  onSubmit={handleLogin} 
                  isLoading={isLoading}
                  error={loginError}
                />
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <RegisterForm 
                  onSubmit={handleRegister} 
                  isLoading={isLoading}
                  error={registerError}
                />
              </TabsContent>
            </Tabs>

            <TestLoginButton />
          </CardContent>

          <CardFooter className="text-center border-t border-slate-100 pt-6 px-6">
            <div className="mx-auto space-y-3">
              <div className="flex items-center justify-center space-x-2 text-slate-500">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">Sécurisé et conforme RGPD</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                En vous connectant, vous acceptez nos{" "}
                <Link 
                  to="/terms" 
                  className="text-blue-600 hover:text-blue-500 transition-colors duration-200 underline-offset-4 hover:underline font-medium"
                >
                  conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link 
                  to="/privacy" 
                  className="text-blue-600 hover:text-blue-500 transition-colors duration-200 underline-offset-4 hover:underline font-medium"
                >
                  politique de confidentialité
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
