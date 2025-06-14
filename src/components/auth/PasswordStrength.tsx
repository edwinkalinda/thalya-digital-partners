
import React from 'react';
import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
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
    
    return { score, feedback };
  };

  const { score, feedback } = evaluatePasswordStrength(password);

  if (!password) return null;

  return (
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
              score <= 2 ? 'bg-red-500' :
              score <= 3 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${(score / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className={`text-xs font-medium ${
          score <= 2 ? 'text-red-500' :
          score <= 3 ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {feedback}
        </span>
      </div>
    </motion.div>
  );
};
