
export const navigationItems = [
  { id: 'thalya-difference', label: 'La différence Thalya' },
  { id: 'philosophy', label: 'Notre philosophie' },
  { id: 'final-cta', label: 'Démarrer' },
];

// Navigation items for authenticated users (admin pages)
export const adminNavigationItems = [
  { id: 'dashboard', label: 'Tableau de bord', path: '/dashboard' },
  { id: 'voice-management', label: 'Gestion vocale', path: '/voice-management' },
  { id: 'onboarding', label: 'Configuration', path: '/onboarding' },
];

export const dashboardNavigationItems = [
  { path: '/dashboard', label: 'Accueil', icon: 'Home' },
  { path: '/voice-management', label: 'Gestion vocale', icon: 'Mic' },
  { path: '/onboarding', label: 'Configuration IA', icon: 'Settings' },
];
