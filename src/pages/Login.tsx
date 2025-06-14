
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

// Types pour les formulaires
type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Animations optimisées avec types corrects
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    
    // Simulation d'appel API avec délai réaliste
    setTimeout(() => {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre écosystème Thalya !",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1200);
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
      });
      setActiveTab("login");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-graphite-50 via-pure-white to-electric-blue/5 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background amélioré avec performance optimisée */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-electric-blue/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity
          }}
        />
        <motion.div 
          className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            delay: 2
          }}
        />
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Lien retour amélioré */}
        <motion.div 
          variants={itemVariants}
          className="mb-6 sm:mb-8"
        >
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
              {/* Logo animé optimisé */}
              <motion.div 
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-electric-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pure-white rounded-full flex items-center justify-center">
                  <Sparkles className="text-electric-blue text-base sm:text-lg" />
                </div>
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-electric-blue/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
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
                <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 h-11">
                  <TabsTrigger value="login" className="text-sm font-medium">
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-sm font-medium">
                    Inscription
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="login" className="space-y-5 sm:space-y-6">
                    <motion.div
                      key="login"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3 }}
                    >
                      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-5 sm:space-y-6">
                    <motion.div
                      key="register"
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3 }}
                    >
                      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </CardContent>

            <CardFooter className="text-center border-t border-graphite-100 pt-4 sm:pt-6 px-4 sm:px-6">
              <p className="text-xs sm:text-sm text-graphite-500 mx-auto leading-relaxed">
                En vous connectant, vous acceptez nos{" "}
                <Link to="/terms" className="text-electric-blue hover:text-blue-600 transition-colors duration-200 underline-offset-4 hover:underline">
                  conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link to="/privacy" className="text-electric-blue hover:text-blue-600 transition-colors duration-200 underline-offset-4 hover:underline">
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
