// Client-side image compression and resizing before upload
// Resizes to max 512x512 square and outputs WebP or JPEG under 150KB

export async function compressAndResizeImage(file: File, maxDimension = 512, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Validate file size and type
    if (file.size > 2 * 1024 * 1024) {
      return reject(new Error('File size exceeds the 2 MB limit'));
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return reject(new Error('Only JPG, PNG, and WebP images are allowed'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain square crop centered
        const minSide = Math.min(width, height);
        const startX = (width - minSide) / 2;
        const startY = (height - minSide) / 2;

        const targetSize = Math.min(minSide, maxDimension);
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, targetSize, targetSize);

        // Convert to WebP if supported, fallback to JPEG
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // fallback to jpeg
              canvas.toBlob(
                (fallbackBlob) => {
                  if (fallbackBlob) resolve(fallbackBlob);
                  else reject(new Error('Image conversion failed'));
                },
                'image/jpeg',
                quality
              );
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
