
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginForm) => void;
  isLoading: boolean;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { 
      email: '', 
      password: '',
      rememberMe: false 
    },
    mode: "onChange"
  });

  const handleSubmit = (data: LoginForm) => {
    onSubmit(data);
  };

  const isFormValid = form.formState.isValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 sm:space-y-6">
        
        {/* Affichage des erreurs générales */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
        
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    placeholder="votre@email.com"
                    className={`pl-12 pr-12 h-12 sm:h-14 border rounded-xl shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 focus:bg-white focus:ring-2 placeholder:text-gray-400 ${
                      fieldState.error 
                        ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20' 
                        : field.value && !fieldState.error
                        ? 'border-green-300 bg-green-50/30 focus:border-green-500 focus:ring-green-500/20'
                        : 'border-gray-200/80 bg-white hover:border-gray-300 focus:border-blue-500/50 focus:ring-blue-500/20'
                    }`}
                    {...field}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  {fieldState.error && (
                    <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                  )}
                  {!fieldState.error && field.value && form.formState.dirtyFields.email && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                </div>
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Mot de passe <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-12 pr-14 h-12 sm:h-14 border rounded-xl shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 focus:bg-white focus:ring-2 placeholder:text-gray-400 ${
                      fieldState.error 
                        ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20' 
                        : field.value && !fieldState.error
                        ? 'border-green-300 bg-green-50/30 focus:border-green-500 focus:ring-green-500/20'
                        : 'border-gray-200/80 bg-white hover:border-gray-300 focus:border-blue-500/50 focus:ring-blue-500/20'
                    }`}
                    {...field}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-500/10 rounded-lg transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />

        {/* Remember Me et Forgot Password */}
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Se souvenir de moi
                </label>
              </div>
            )}
          />
          
          <Link 
            to="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Button 
            type="submit" 
            className="w-full h-12 sm:h-14 relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isFormValid}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
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

        {/* Aide contextuelle */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Besoin d'aide ? Contactez notre{" "}
            <Link to="/support" className="text-blue-600 hover:text-blue-700 underline">
              support client
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};
