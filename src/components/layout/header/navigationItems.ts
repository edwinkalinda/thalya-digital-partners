
export const navigationItems = [
  { id: 'thalya-difference', label: 'La différence Thalya' },
  { id: 'philosophy', label: 'Notre philosophie' },
  { id: 'final-cta', label: 'Démarrer' },
];

// Navigation items for authenticated users (admin pages)
export const adminNavigationItems = [
  { id: 'dashboard', label: 'Tableau de bord', path: '/dashboard' },
  { id: 'voice-management', label: 'Gestion vocale', path: '/voice-management' },
  { id: 'ai-config', label: 'Configuration IA', path: '/ai-config' },
];

export const dashboardNavigationItems = [
  { path: '/dashboard', label: 'Accueil', icon: 'Home' },
  { path: '/voice-management', label: 'Gestion vocale', icon: 'Mic' },
  { path: '/ai-config', label: 'Configuration IA', icon: 'Settings' },
  { path: '/clinic-dashboard', label: 'Clinique', icon: 'Heart' },
  { path: '/restaurant-dashboard', label: 'Restaurant', icon: 'UtensilsCrossed' },
  { path: '/real-estate-dashboard', label: 'Immobilier', icon: 'Building' },
  { path: '/outreach-dashboard', label: 'Outreach', icon: 'Target' },
];
