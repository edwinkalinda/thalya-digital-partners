
export function createThalyaLogoSVG(): string {
  return `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.2" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Fond blanc -->
      <rect width="100" height="100" fill="white"/>
      
      <!-- Forme principale - représente l'IA conversationnelle -->
      <!-- Cercle central (cerveau/intelligence) -->
      <circle cx="50" cy="50" r="18" fill="url(#primaryGrad)" filter="url(#glow)"/>
      <circle cx="50" cy="50" r="12" fill="url(#centerGrad)"/>
      
      <!-- Ondes de communication - 3 arcs concentriques -->
      <path d="M 30 50 A 20 20 0 0 1 70 50" 
            stroke="url(#accentGrad)" 
            stroke-width="3" 
            fill="none" 
            opacity="0.8"/>
      <path d="M 25 50 A 25 25 0 0 1 75 50" 
            stroke="url(#accentGrad)" 
            stroke-width="2" 
            fill="none" 
            opacity="0.6"/>
      <path d="M 20 50 A 30 30 0 0 1 80 50" 
            stroke="url(#accentGrad)" 
            stroke-width="1" 
            fill="none" 
            opacity="0.4"/>
      
      <!-- Formes géométriques représentant les données/connexions -->
      <!-- Triangle supérieur gauche -->
      <path d="M25 25 L35 15 L40 30 Z" fill="url(#accentGrad)" opacity="0.7"/>
      
      <!-- Triangle supérieur droit -->
      <path d="M75 25 L65 15 L60 30 Z" fill="url(#accentGrad)" opacity="0.7"/>
      
      <!-- Hexagone inférieur gauche -->
      <path d="M30 75 L25 82 L20 75 L25 68 L35 68 L35 75 Z" fill="url(#accentGrad)" opacity="0.6"/>
      
      <!-- Hexagone inférieur droit -->
      <path d="M70 75 L75 82 L80 75 L75 68 L65 68 L65 75 Z" fill="url(#accentGrad)" opacity="0.6"/>
      
      <!-- Points de connexion lumineux -->
      <circle cx="35" cy="35" r="3" fill="url(#accentGrad)" opacity="0.9"/>
      <circle cx="65" cy="35" r="3" fill="url(#accentGrad)" opacity="0.9"/>
      <circle cx="35" cy="65" r="3" fill="url(#accentGrad)" opacity="0.9"/>
      <circle cx="65" cy="65" r="3" fill="url(#accentGrad)" opacity="0.9"/>
      
      <!-- Lignes de connexion subtiles -->
      <line x1="35" y1="35" x2="50" y2="32" stroke="url(#accentGrad)" stroke-width="1" opacity="0.3"/>
      <line x1="65" y1="35" x2="50" y2="32" stroke="url(#accentGrad)" stroke-width="1" opacity="0.3"/>
      <line x1="35" y1="65" x2="50" y2="68" stroke="url(#accentGrad)" stroke-width="1" opacity="0.3"/>
      <line x1="65" y1="65" x2="50" y2="68" stroke="url(#accentGrad)" stroke-width="1" opacity="0.3"/>
      
      <!-- Particules brillantes pour l'effet dynamique -->
      <circle cx="42" cy="25" r="1.5" fill="url(#accentGrad)" opacity="0.8"/>
      <circle cx="58" cy="25" r="1" fill="url(#accentGrad)" opacity="0.6"/>
      <circle cx="25" cy="58" r="1" fill="url(#accentGrad)" opacity="0.7"/>
      <circle cx="75" cy="42" r="1.5" fill="url(#accentGrad)" opacity="0.5"/>
      
      <!-- Détails de profondeur -->
      <circle cx="50" cy="50" r="6" fill="none" stroke="url(#accentGrad)" stroke-width="0.5" opacity="0.4"/>
      <circle cx="50" cy="50" r="3" fill="url(#accentGrad)" opacity="0.3"/>
    </svg>
  `;
}

export function svgToImageData(svgString: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      
      const imageData = ctx.getImageData(0, 0, 100, 100);
      URL.revokeObjectURL(url);
      resolve(imageData);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };
    
    img.src = url;
  });
}
