
export function createThalyaLogoSVG(): string {
  return `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="white"/>
      
      <!-- T principal avec empattements -->
      <rect x="15" y="15" width="70" height="12" fill="url(#logoGradient)"/>
      <rect x="44" y="15" width="12" height="70" fill="url(#logoGradient)"/>
      
      <!-- Détails géométriques pour l'unicité -->
      <rect x="20" y="20" width="60" height="3" fill="url(#logoGradient)"/>
      <rect x="47" y="27" width="6" height="58" fill="url(#logoGradient)"/>
      
      <!-- Elements décoratifs pour effet 3D -->
      <polygon points="15,15 27,15 27,27 15,27" fill="#333"/>
      <polygon points="73,15 85,15 85,27 73,27" fill="#333"/>
      <polygon points="44,73 56,73 56,85 44,85" fill="#333"/>
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
