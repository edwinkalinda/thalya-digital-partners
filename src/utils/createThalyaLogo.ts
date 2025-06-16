
export const createThalyaLogoSVG = (): string => {
  return `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="thalyaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0066FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00D4FF;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#thalyaGradient)" />
      <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="white" opacity="0.8" />
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
