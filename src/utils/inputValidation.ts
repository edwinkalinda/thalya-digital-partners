
import { z } from 'zod';

// Schémas de validation pour les différents types de données
export const leadValidationSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().min(1, "Le téléphone est requis").regex(/^[\d\s\-\+\(\)]+$/, "Format de téléphone invalide"),
  status: z.enum(['new', 'contacted', 'qualified', 'closed']).optional(),
});

export const campaignValidationSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200, "Le titre est trop long"),
  description: z.string().max(1000, "La description est trop longue").optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
});

export const appointmentValidationSchema = z.object({
  patient_name: z.string().min(1, "Le nom du patient est requis").max(100, "Le nom est trop long"),
  phone_number: z.string().min(1, "Le téléphone est requis").regex(/^[\d\s\-\+\(\)]+$/, "Format de téléphone invalide"),
  appointment_time: z.string().refine((val) => !isNaN(Date.parse(val)), "Date invalide"),
  reason: z.string().max(500, "La raison est trop longue").optional(),
});

// Fonction utilitaire pour nettoyer et valider les données d'entrée
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>'"]/g, '') // Supprime les caractères dangereux
    .substring(0, 1000); // Limite la longueur
}

// Fonction pour valider les données avec gestion d'erreur
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
}
