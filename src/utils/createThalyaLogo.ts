export function createThalyaLogoSVG(): string {
  return `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Dégradés basés sur l'image de référence -->
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0052ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0891b2;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6d28d9;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7e22ce;stop-opacity:1" />
        </linearGradient>
        
        <!-- Ombres pour l'effet 3D -->
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Fond transparent -->
      <rect width="100" height="100" fill="transparent"/>
      
      <!-- Infini supérieur gauche (bleu) -->
      <path d="M 15 25 
               C 15 15, 25 15, 35 25
               C 45 35, 55 35, 55 25
               C 55 15, 45 15, 35 25
               C 25 35, 15 35, 15 25 Z" 
            fill="url(#blueGrad)" 
            filter="url(#shadow)"
            stroke="none"/>
      
      <!-- Infini supérieur droit (cyan) -->
      <path d="M 45 25 
               C 45 15, 55 15, 65 25
               C 75 35, 85 35, 85 25
               C 85 15, 75 15, 65 25
               C 55 35, 45 35, 45 25 Z" 
            fill="url(#cyanGrad)" 
            filter="url(#shadow)"
            stroke="none"/>
      
      <!-- Infini inférieur gauche (violet) -->
      <path d="M 15 75 
               C 15 65, 25 65, 35 75
               C 45 85, 55 85, 55 75
               C 55 65, 45 65, 35 75
               C 25 85, 15 85, 15 75 Z" 
            fill="url(#violetGrad)" 
            filter="url(#shadow)"
            stroke="none"/>
      
      <!-- Infini inférieur droit (purple) -->
      <path d="M 45 75 
               C 45 65, 55 65, 65 75
               C 75 85, 85 85, 85 75
               C 85 65, 75 65, 65 75
               C 55 85, 45 85, 45 75 Z" 
            fill="url(#purpleGrad)" 
            filter="url(#shadow)"
            stroke="none"/>
      
      <!-- Zones d'intersection pour créer l'effet d'entrelacement -->
      <ellipse cx="50" cy="35" rx="8" ry="15" fill="url(#cyanGrad)" opacity="0.9"/>
      <ellipse cx="50" cy="65" rx="8" ry="15" fill="url(#purpleGrad)" opacity="0.9"/>
      <ellipse cx="35" cy="50" rx="15" ry="8" fill="url(#blueGrad)" opacity="0.8"/>
      <ellipse cx="65" cy="50" rx="15" ry="8" fill="url(#violetGrad)" opacity="0.8"/>
      
      <!-- Reflets pour l'effet métallique -->
      <ellipse cx="30" cy="20" rx="4" ry="3" fill="white" opacity="0.4"/>
      <ellipse cx="70" cy="20" rx="4" ry="3" fill="white" opacity="0.4"/>
      <ellipse cx="30" cy="80" rx="4" ry="3" fill="white" opacity="0.4"/>
      <ellipse cx="70" cy="80" rx="4" ry="3" fill="white" opacity="0.4"/>
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
