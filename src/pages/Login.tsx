
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Validation schemas avec messages d'erreur améliorés
const loginSchema = z.object({
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .max(50, "Le mot de passe ne peut pas dépasser 50 caractères"),
});

const registerSchema = z.object({
  name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s]*$/, "Le nom ne peut contenir que des lettres"),
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(50, "Le mot de passe ne peut pas dépasser 50 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

// Animations optimisées avec types corrects
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [formStrength, setFormStrength] = useState({ score: 0, feedback: "" });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: "onChange" // Validation en temps réel
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    mode: "onChange"
  });

  // Évaluation de la force du mot de passe
  const evaluatePasswordStrength = (password: string) => {
    let score = 0;
    let feedback = "";
    
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    switch (score) {
      case 0:
      case 1:
        feedback = "Très faible";
        break;
      case 2:
        feedback = "Faible";
        break;
      case 3:
        feedback = "Moyen";
        break;
      case 4:
        feedback = "Fort";
        break;
      case 5:
        feedback = "Très fort";
        break;
    }
    
    setFormStrength({ score, feedback });
  };

  const handleLogin = async (data: LoginForm) => {
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

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
      });
      setActiveTab("login");
      registerForm.reset();
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
            repeat: Infinity, 
            ease: "easeInOut" 
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
            ease: "easeInOut",
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
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5 sm:space-y-6">
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-graphite-700 font-medium">Email</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite-400 w-4 h-4 transition-colors group-focus-within:text-electric-blue" />
                                    <Input
                                      placeholder="votre@email.com"
                                      className="pl-10 h-11 sm:h-12 border-graphite-200 focus:border-electric-blue focus:ring-electric-blue/20 transition-all duration-300"
                                      {...field}
                                    />
                                    {fieldState.error && (
                                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                                    )}
                                    {!fieldState.error && field.value && (
                                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                                    )}
                                  </div>
                                </FormControl>
                                <AnimatePresence>
                                  {fieldState.error && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <FormMessage />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-graphite-700 font-medium">Mot de passe</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite-400 w-4 h-4 transition-colors group-focus-within:text-electric-blue" />
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      className="pl-10 pr-12 h-11 sm:h-12 border-graphite-200 focus:border-electric-blue focus:ring-electric-blue/20 transition-all duration-300"
                                      {...field}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-electric-blue/10 transition-colors duration-200"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                </FormControl>
                                <AnimatePresence>
                                  {fieldState.error && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <FormMessage />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </FormItem>
                            )}
                          />

                          {/* Lien mot de passe oublié */}
                          <div className="flex justify-end">
                            <Link 
                              to="/forgot-password" 
                              className="text-sm text-electric-blue hover:text-blue-600 transition-colors duration-200"
                            >
                              Mot de passe oublié ?
                            </Link>
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full h-11 sm:h-12 bg-gradient-to-r from-electric-blue to-blue-600 hover:from-blue-600 hover:to-electric-blue text-white font-medium transition-all duration-300 transform hover:scale-[1.01] disabled:scale-100" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <motion.div 
                                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                Connexion en cours...
                              </div>
                            ) : (
                              "Se connecter"
                            )}
                          </Button>
                        </form>
                      </Form>
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
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-5 sm:space-y-6">
                          <FormField
                            control={registerForm.control}
                            name="name"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-graphite-700 font-medium">Nom complet</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite-400 w-4 h-4 transition-colors group-focus-within:text-electric-blue" />
                                    <Input
                                      placeholder="Votre nom"
                                      className="pl-10 h-11 sm:h-12 border-graphite-200 focus:border-electric-blue focus:ring-electric-blue/20 transition-all duration-300"
                                      {...field}
                                    />
                                    {fieldState.error && (
                                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                                    )}
                                    {!fieldState.error && field.value && (
                                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                                    )}
                                  </div>
                                </FormControl>
                                <AnimatePresence>
                                  {fieldState.error && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <FormMessage />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-graphite-700 font-medium">Email</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite-400 w-4 h-4 transition-colors group-focus-within:text-electric-blue" />
                                    <Input
                                      placeholder="votre@email.com"
                                      className="pl-10 h-11 sm:h-12 border-graphite-200 focus:border-electric-blue focus:ring-electric-blue/20 transition-all duration-300"
                                      {...field}
                                    />
                                    {fieldState.error && (
                                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                                    )}
                                    {!fieldState.error && field.value && (
                                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                                    )}
                                  </div>
                                </FormControl>
                                <AnimatePresence>
                                  {fieldState.error && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <FormMessage />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-graphite-700 font-medium">Mot de passe</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite-400 w-4 h-4 transition-colors group-focus-within:text-electric-blue" />
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      className="pl-10 pr-12 h-11 sm:h-12 border-graphite-200 focus:border-electric-blue focus:ring-electric-blue/20 transition-all duration-300"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        evaluatePasswordStrength(e.target.value);
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-electric-blue/10 transition-colors duration-200"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                </FormControl>
                                
                                {/* Indicateur de force du mot de passe */}
                                {field.value && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="flex-1 bg-graphite-200 rounded-full h-2">
                                        <motion.div
                                          className={`h-full rounded-full transition-all duration-300 ${
                                            formStrength.score <= 2 ? 'bg-red-500' :
                                            formStrength.score <= 3 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                          }`}
                                          initial={{ width: 0 }}
                                          animate={{ width: `${(formStrength.score / 5) * 100}%` }}
                                          transition={{ duration: 0.3 }}
                                        />
                                      </div>
                                      <span className={`text-xs font-medium ${
                                        formStrength.score <= 2 ? 'text-red-500' :
                                        formStrength.score <= 3 ? 'text-yellow-500' :
                                        'text-green-500'
                                      }`}>
                                        {formStrength.feedback}
                                      </span>
                                    </div>
                                  </motion.div>
                                )}

                                <AnimatePresence>
                                  {fieldState.error && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <FormMessage />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-graphite-700 font-medium">Confirmer le mot de passe</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graphite-400 w-4 h-4 transition-colors group-focus-within:text-electric-blue" />
                                    <Input
                                      type={showConfirmPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      className="pl-10 pr-12 h-11 sm:h-12 border-graphite-200 focus:border-electric-blue focus:ring-electric-blue/20 transition-all duration-300"
                                      {...field}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-electric-blue/10 transition-colors duration-200"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                  </div>
                                </FormControl>
                                <AnimatePresence>
                                  {fieldState.error && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <FormMessage />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </FormItem>
                            )}
                          />

                          <Button 
                            type="submit" 
                            className="w-full h-11 sm:h-12 bg-gradient-to-r from-electric-blue to-blue-600 hover:from-blue-600 hover:to-electric-blue text-white font-medium transition-all duration-300 transform hover:scale-[1.01] disabled:scale-100" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <motion.div 
                                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                Création en cours...
                              </div>
                            ) : (
                              "Créer un compte"
                            )}
                          </Button>
                        </form>
                      </Form>
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
