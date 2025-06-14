
export function createThalyaLogoSVG(): string {
  return `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Dégradés inspirés de l'image de référence -->
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0052ff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3730a3;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#0891b2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0e7490;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6d28d9;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#9333ea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7e22ce;stop-opacity:1" />
        </linearGradient>
        
        <!-- Filtre pour l'effet lumineux -->
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Fond blanc -->
      <rect width="100" height="100" fill="white"/>
      
      <!-- Forme d'infini supérieure gauche (bleu) -->
      <path d="M 20 35 
               C 20 25, 30 25, 35 35
               C 40 45, 50 45, 50 35
               C 50 25, 40 25, 35 35
               C 30 45, 20 45, 20 35 Z" 
            fill="url(#blueGrad)" 
            filter="url(#glow)"
            opacity="0.95"/>
      
      <!-- Forme d'infini supérieure droite (cyan) -->
      <path d="M 50 35 
               C 50 25, 60 25, 65 35
               C 70 45, 80 45, 80 35
               C 80 25, 70 25, 65 35
               C 60 45, 50 45, 50 35 Z" 
            fill="url(#cyanGrad)" 
            filter="url(#glow)"
            opacity="0.9"/>
      
      <!-- Forme d'infini inférieure gauche (violet) -->
      <path d="M 20 65 
               C 20 55, 30 55, 35 65
               C 40 75, 50 75, 50 65
               C 50 55, 40 55, 35 65
               C 30 75, 20 75, 20 65 Z" 
            fill="url(#violetGrad)" 
            filter="url(#glow)"
            opacity="0.9"/>
      
      <!-- Forme d'infini inférieure droite (purple) -->
      <path d="M 50 65 
               C 50 55, 60 55, 65 65
               C 70 75, 80 75, 80 65
               C 80 55, 70 55, 65 65
               C 60 75, 50 75, 50 65 Z" 
            fill="url(#purpleGrad)" 
            filter="url(#glow)"
            opacity="0.95"/>
      
      <!-- Connexions centrales pour créer l'entrelacement -->
      <ellipse cx="50" cy="42.5" rx="4" ry="7.5" fill="url(#cyanGrad)" opacity="0.8"/>
      <ellipse cx="50" cy="57.5" rx="4" ry="7.5" fill="url(#purpleGrad)" opacity="0.8"/>
      
      <!-- Points de connexion brillants -->
      <circle cx="35" cy="35" r="2" fill="url(#blueGrad)" opacity="0.8"/>
      <circle cx="65" cy="35" r="2" fill="url(#cyanGrad)" opacity="0.8"/>
      <circle cx="35" cy="65" r="2" fill="url(#violetGrad)" opacity="0.8"/>
      <circle cx="65" cy="65" r="2" fill="url(#purpleGrad)" opacity="0.8"/>
      
      <!-- Reflets subtils pour l'effet 3D -->
      <ellipse cx="27.5" cy="30" rx="3" ry="2" fill="white" opacity="0.3"/>
      <ellipse cx="57.5" cy="30" rx="3" ry="2" fill="white" opacity="0.3"/>
      <ellipse cx="27.5" cy="60" rx="3" ry="2" fill="white" opacity="0.3"/>
      <ellipse cx="57.5" cy="60" rx="3" ry="2" fill="white" opacity="0.3"/>
      
      <!-- Particules d'énergie pour l'aspect dynamique -->
      <circle cx="42" cy="20" r="1" fill="url(#blueGrad)" opacity="0.6"/>
      <circle cx="58" cy="20" r="1.5" fill="url(#cyanGrad)" opacity="0.7"/>
      <circle cx="15" cy="50" r="1" fill="url(#violetGrad)" opacity="0.5"/>
      <circle cx="85" cy="50" r="1" fill="url(#purpleGrad)" opacity="0.6"/>
      <circle cx="42" cy="80" r="1.5" fill="url(#violetGrad)" opacity="0.7"/>
      <circle cx="58" cy="80" r="1" fill="url(#purpleGrad)" opacity="0.5"/>
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
