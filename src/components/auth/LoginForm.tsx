
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
              <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    placeholder="votre@email.com"
                    className="pl-12 h-12 sm:h-14 border border-gray-200/80 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 focus:shadow-lg transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 placeholder:text-gray-400"
                    {...field}
                  />
                  {fieldState.error && (
                    <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                  )}
                  {!fieldState.error && field.value && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
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
              <FormLabel className="text-gray-700 font-medium">Mot de passe</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-12 pr-14 h-12 sm:h-14 border border-gray-200/80 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 focus:shadow-lg transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 placeholder:text-gray-400"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-500/10 rounded-lg transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Button 
            type="submit" 
            className="w-full h-12 sm:h-14 relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 group"
            disabled={isLoading}
          >
            
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            
            <div className="absolute inset-0 rounded-xl bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            
            
            <div className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center">
                  <motion.div 
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-white">Connexion en cours...</span>
                </div>
              ) : (
                <span className="flex items-center">
                  Se connecter
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.div>
                </span>
              )}
            </div>
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};
