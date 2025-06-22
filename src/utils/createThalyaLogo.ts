
export const createThalyaLogoSVG = (): string => {
  return `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="thalyaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0066FF;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#0099FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00D4FF;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0.6" />
        </linearGradient>
      </defs>
      
      <!-- Outer circle with gradient -->
      <circle cx="16" cy="16" r="15" fill="url(#thalyaGradient)" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
      
      <!-- Inner geometric pattern -->
      <g transform="translate(16,16)">
        <!-- Central diamond -->
        <path d="M-6,-6 L0,-10 L6,-6 L10,0 L6,6 L0,10 L-6,6 L-10,0 Z" fill="url(#innerGradient)"/>
        
        <!-- Inner accent -->
        <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,0.8)"/>
        <circle cx="0" cy="0" r="1.5" fill="#0066FF"/>
      </g>
      
      <!-- Subtle glow effect -->
      <circle cx="16" cy="16" r="15" fill="none" stroke="url(#thalyaGradient)" stroke-width="0.5" opacity="0.6"/>
    </svg>
  `;
};

export const svgToImageData = async (svgString: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 32;
    canvas.height = 32;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 32, 32);
      const imageData = ctx?.getImageData(0, 0, 32, 32);
      if (imageData) {
        resolve(imageData);
      } else {
        reject(new Error('Failed to get image data'));
      }
    };
    
    img.onerror = reject;
    img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
  });
};
