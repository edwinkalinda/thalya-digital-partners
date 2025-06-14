
export function createThalyaLogoSVG(): string {
  return `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Fond transparent -->
      <rect width="200" height="200" fill="transparent"/>
      
      <!-- Boucle supérieure gauche -->
      <path d="M 30 70
               C 30 40, 60 40, 60 70
               C 60 85, 75 100, 100 100
               C 125 100, 140 85, 140 70
               C 140 40, 170 40, 170 70
               C 170 130, 100 130, 100 70
               C 100 55, 85 40, 70 40
               C 45 40, 30 55, 30 70 Z" 
            fill="black"/>
      
      <!-- Boucle supérieure droite -->
      <path d="M 170 70
               C 170 40, 140 40, 140 70
               C 140 85, 125 100, 100 100
               C 75 100, 60 85, 60 70
               C 60 40, 30 40, 30 70
               C 30 130, 100 130, 100 70
               C 100 55, 115 40, 130 40
               C 155 40, 170 55, 170 70 Z" 
            fill="black"/>
      
      <!-- Boucle inférieure gauche -->
      <path d="M 30 130
               C 30 160, 60 160, 60 130
               C 60 115, 75 100, 100 100
               C 125 100, 140 115, 140 130
               C 140 160, 170 160, 170 130
               C 170 70, 100 70, 100 130
               C 100 145, 85 160, 70 160
               C 45 160, 30 145, 30 130 Z" 
            fill="black"/>
      
      <!-- Boucle inférieure droite -->
      <path d="M 170 130
               C 170 160, 140 160, 140 130
               C 140 115, 125 100, 100 100
               C 75 100, 60 115, 60 130
               C 60 160, 30 160, 30 130
               C 30 70, 100 70, 100 130
               C 100 145, 115 160, 130 160
               C 155 160, 170 145, 170 130 Z" 
            fill="black"/>
      
      <!-- Zone centrale d'intersection -->
      <circle cx="100" cy="100" r="25" fill="black"/>
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
      
      // Taille optimisée pour l'effet métallique
      canvas.width = 200;
      canvas.height = 200;
      ctx.drawImage(img, 0, 0, 200, 200);
      
      const imageData = ctx.getImageData(0, 0, 200, 200);
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
