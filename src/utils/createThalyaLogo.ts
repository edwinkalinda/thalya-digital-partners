
export function createThalyaLogoSVG(): string {
  return `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2a2a2a;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
        </linearGradient>
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
      
      <!-- Corps principal du T moderne -->
      <path d="M20 20 L80 20 L80 30 L55 30 L55 80 L45 80 L45 30 L20 30 Z" fill="url(#primaryGrad)" filter="url(#glow)"/>
      
      <!-- Éléments géométriques décoratifs -->
      <!-- Triangle supérieur gauche -->
      <path d="M15 15 L25 15 L20 25 Z" fill="url(#accentGrad)"/>
      
      <!-- Triangle supérieur droit -->
      <path d="M75 15 L85 15 L80 25 Z" fill="url(#accentGrad)"/>
      
      <!-- Ligne verticale accent -->
      <rect x="48" y="32" width="4" height="46" fill="url(#accentGrad)"/>
      
      <!-- Points lumineux -->
      <circle cx="22" cy="22" r="2" fill="url(#accentGrad)" opacity="0.8"/>
      <circle cx="78" cy="22" r="2" fill="url(#accentGrad)" opacity="0.8"/>
      <circle cx="50" cy="78" r="2" fill="url(#accentGrad)" opacity="0.8"/>
      
      <!-- Lignes d'accent horizontales -->
      <rect x="20" y="26" width="60" height="1" fill="url(#accentGrad)" opacity="0.6"/>
      <rect x="45" y="75" width="10" height="1" fill="url(#accentGrad)" opacity="0.6"/>
      
      <!-- Éléments de profondeur -->
      <rect x="22" y="32" width="2" height="3" fill="url(#accentGrad)" opacity="0.4"/>
      <rect x="76" y="32" width="2" height="3" fill="url(#accentGrad)" opacity="0.4"/>
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
