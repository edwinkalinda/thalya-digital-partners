
export function createThalyaLogoSVG(): string {
  return `
    <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2a2a2a;stop-opacity:1" />
          <stop offset="30%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="60" fill="white"/>
      
      <!-- Fond avec empattements pour THALYA -->
      <text x="100" y="45" font-family="serif" font-size="36" font-weight="900" text-anchor="middle" fill="url(#logoGradient)" letter-spacing="2px">THALYA</text>
      
      <!-- Accent décoratif sous le texte -->
      <rect x="30" y="50" width="140" height="3" fill="url(#accentGradient)" rx="1.5"/>
      
      <!-- Points décoratifs -->
      <circle cx="25" cy="51.5" r="2" fill="url(#accentGradient)"/>
      <circle cx="175" cy="51.5" r="2" fill="url(#accentGradient)"/>
      
      <!-- Détails géométriques sur les lettres -->
      <rect x="35" y="12" width="2" height="25" fill="url(#accentGradient)"/>
      <rect x="65" y="20" width="2" height="17" fill="url(#accentGradient)"/>
      <rect x="95" y="15" width="2" height="22" fill="url(#accentGradient)"/>
      <rect x="125" y="18" width="2" height="19" fill="url(#accentGradient)"/>
      <rect x="155" y="16" width="2" height="21" fill="url(#accentGradient)"/>
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
