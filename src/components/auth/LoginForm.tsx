
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .max(50, "Le mot de passe ne peut pas dépasser 50 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginForm) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: "onChange"
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
        <FormField
          control={form.control}
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
          control={form.control}
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
  );
};
