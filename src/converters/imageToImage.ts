import type { FileItem } from '../types';

export const convertImageToFormat = async (
  fileItem: FileItem,
  format: 'webp' | 'png' | 'jpg',
  qualityPercent: number
): Promise<{ blob: Blob; filename: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(fileItem.file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      const mimeType =
        format === 'webp' ? 'image/webp' : format === 'png' ? 'image/png' : 'image/jpeg';

      // If JPG, fill with white background
      if (format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const quality = Math.max(0.1, Math.min(1.0, qualityPercent / 100));

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error(`Failed to convert image to ${format}`));
            return;
          }
          const baseName = fileItem.name.replace(/\.[^/.]+$/, '');
          const extension = format === 'jpg' ? 'jpg' : format;
          resolve({
            blob,
            filename: `${baseName}.${extension}`,
          });
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not load image: ${fileItem.name}`));
    };

    img.src = url;
  });
};
