
export function createThalyaLogoSVG(): string {
  return `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Dégradés basés sur l'image de référence -->
        <linearGradient id="topLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="topRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="bottomLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient id="bottomRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
        </linearGradient>
        
        <!-- Ombre pour l'effet 3D -->
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.2"/>
        </filter>
      </defs>
      
      <!-- Fond transparent -->
      <rect width="100" height="100" fill="transparent"/>
      
      <!-- Boucle supérieure gauche (bleu foncé) -->
      <path d="M 15 35
               A 20 20 0 1 1 35 15
               A 10 10 0 0 0 35 35
               A 10 10 0 0 0 15 35 Z" 
            fill="url(#topLeftGrad)" 
            filter="url(#shadow)"/>
      
      <!-- Boucle supérieure droite (cyan) -->
      <path d="M 65 15
               A 20 20 0 1 1 85 35
               A 10 10 0 0 0 65 35
               A 10 10 0 0 0 65 15 Z" 
            fill="url(#topRightGrad)" 
            filter="url(#shadow)"/>
      
      <!-- Boucle inférieure gauche (violet) -->
      <path d="M 15 65
               A 20 20 0 1 1 35 85
               A 10 10 0 0 0 35 65
               A 10 10 0 0 0 15 65 Z" 
            fill="url(#bottomLeftGrad)" 
            filter="url(#shadow)"/>
      
      <!-- Boucle inférieure droite (bleu) -->
      <path d="M 65 85
               A 20 20 0 1 1 85 65
               A 10 10 0 0 0 65 65
               A 10 10 0 0 0 65 85 Z" 
            fill="url(#bottomRightGrad)" 
            filter="url(#shadow)"/>
      
      <!-- Zone d'intersection centrale pour l'entrelacement -->
      <ellipse cx="50" cy="50" rx="12" ry="12" fill="url(#topRightGrad)" opacity="0.8"/>
      
      <!-- Reflets pour l'effet métallique -->
      <ellipse cx="25" cy="25" rx="3" ry="2" fill="white" opacity="0.3"/>
      <ellipse cx="75" cy="25" rx="3" ry="2" fill="white" opacity="0.3"/>
      <ellipse cx="25" cy="75" rx="3" ry="2" fill="white" opacity="0.3"/>
      <ellipse cx="75" cy="75" rx="3" ry="2" fill="white" opacity="0.3"/>
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
