
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/layout/header/Logo";

// Types pour les formulaires
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

// Animations simplifiées
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState<string | undefined>();
  const navigate = useNavigate();
  const { signIn, signUp, user, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    setLoginError(undefined);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        console.error('Login error:', error);
        setLoginError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setLoginError('Une erreur inattendue s\'est produite lors de la connexion.');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    const [firstName, ...lastNameParts] = data.name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    try {
      const { error } = await signUp(data.email, data.password, firstName, lastName);
      
      if (!error) {
        setActiveTab("login");
      }
    } catch (err) {
      console.error('Unexpected registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite-50 via-pure-white to-electric-blue/5 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background simplifié */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-electric-blue/10 rounded-full blur-3xl" 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity }} 
        />
        <motion.div 
          className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl" 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, delay: 2 }} 
        />
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
      >
        {/* Lien retour */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-graphite-600 hover:text-electric-blue transition-all duration-300 group text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Retour à l'accueil
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-2xl border-0 bg-pure-white/90 backdrop-blur-lg">
            <CardHeader className="text-center pb-4">
              <motion.div 
                className="flex justify-center mb-4 sm:mb-6" 
                whileHover={{ scale: 1.05 }} 
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="scale-75 sm:scale-100">
                  <Logo />
                </div>
              </motion.div>

              <CardTitle className="text-2xl sm:text-3xl font-bold text-deep-black mb-2">
                Bienvenue sur Thalya
              </CardTitle>
              <CardDescription className="text-graphite-600 text-base sm:text-lg">
                Votre écosystème d'IA conversationnelle
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
                  <TabsTrigger value="login" className="text-sm font-semibold">
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-sm font-semibold">
                    Inscription
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-5 sm:space-y-6">
                  <LoginForm 
                    onSubmit={handleLogin} 
                    isLoading={isLoading}
                    error={loginError}
                  />
                </TabsContent>

                <TabsContent value="register" className="space-y-5 sm:space-y-6">
                  <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="text-center border-t border-graphite-100 pt-4 sm:pt-6 px-4 sm:px-6">
              <p className="text-xs sm:text-sm text-graphite-500 mx-auto leading-relaxed">
                En vous connectant, vous acceptez nos{" "}
                <Link 
                  to="/terms" 
                  className="text-electric-blue hover:text-blue-600 transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link 
                  to="/privacy" 
                  className="text-electric-blue hover:text-blue-600 transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  politique de confidentialité
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
