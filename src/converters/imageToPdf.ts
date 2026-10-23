import { PDFDocument } from 'pdf-lib';
import type { ConversionOptions, FileItem } from '../types';

// Standard paper dimensions in PostScript points (72 points per inch)
const PAGE_DIMENSIONS = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const MARGIN_SIZES = {
  none: 0,
  small: 18, // 0.25 in
  normal: 36, // 0.5 in
};

/**
 * Loads an image file into an HTMLImageElement
 */
const loadImageElement = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
};

/**
 * Converts an image file to standard JPEG or PNG bytes using an in-memory Canvas
 */
const rasterizeToBytes = async (
  img: HTMLImageElement,
  format: 'image/jpeg' | 'image/png',
  quality: number
): Promise<Uint8Array> => {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Fill with white background in case source had transparency
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }
        const buffer = await blob.arrayBuffer();
        resolve(new Uint8Array(buffer));
      },
      format,
      quality
    );
  });
};

/**
 * Client-side conversion from one or more images into a PDF document
 */
export const convertImagesToPdf = async (
  files: FileItem[],
  options: ConversionOptions,
  onProgress?: (progress: number, statusText: string) => void
): Promise<{ blob: Blob; filename: string }> => {
  if (files.length === 0) {
    throw new Error('No files provided for conversion');
  }

  onProgress?.(5, 'Initializing PDF document...');
  const pdfDoc = await PDFDocument.create();

  const totalFiles = files.length;

  for (let i = 0; i < totalFiles; i++) {
    const item = files[i];
    const stepPct = Math.round(10 + (i / totalFiles) * 80);
    onProgress?.(stepPct, `Processing image ${i + 1} of ${totalFiles}: ${item.name}...`);

    const img = await loadImageElement(item.file);
    const imgWidth = img.naturalWidth || 800;
    const imgHeight = img.naturalHeight || 600;

    // Determine embedded image bytes
    let embeddedImage;
    const isJpeg = item.file.type === 'image/jpeg' || item.file.type === 'image/jpg';
    const isPng = item.file.type === 'image/png';

    try {
      if (!options.compressFile && isJpeg) {
        const rawBytes = new Uint8Array(await item.file.arrayBuffer());
        embeddedImage = await pdfDoc.embedJpg(rawBytes);
      } else if (!options.compressFile && isPng) {
        const rawBytes = new Uint8Array(await item.file.arrayBuffer());
        embeddedImage = await pdfDoc.embedPng(rawBytes);
      } else {
        // High quality rasterization with user-specified quality
        const quality = Math.max(0.1, Math.min(1.0, options.quality / 100));
        const jpegBytes = await rasterizeToBytes(img, 'image/jpeg', quality);
        embeddedImage = await pdfDoc.embedJpg(jpegBytes);
      }
    } catch {
      // Fallback: rasterize via canvas if direct embedding failed
      const jpegBytes = await rasterizeToBytes(img, 'image/jpeg', 0.9);
      embeddedImage = await pdfDoc.embedJpg(jpegBytes);
    }

    // Determine page width and height
    const margin = MARGIN_SIZES[options.margin];
    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === 'fit') {
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    } else {
      const baseDim = PAGE_DIMENSIONS[options.pageSize];
      let isLandscape = false;

      if (options.orientation === 'landscape') {
        isLandscape = true;
      } else if (options.orientation === 'portrait') {
        isLandscape = false;
      } else {
        // Auto orientation
        isLandscape = imgWidth > imgHeight;
      }

      pageWidth = isLandscape ? Math.max(baseDim.width, baseDim.height) : Math.min(baseDim.width, baseDim.height);
      pageHeight = isLandscape ? Math.min(baseDim.width, baseDim.height) : Math.max(baseDim.width, baseDim.height);
    }

    // Calculate maximum image box within margins
    const availableWidth = Math.max(10, pageWidth - margin * 2);
    const availableHeight = Math.max(10, pageHeight - margin * 2);

    // Scale image maintaining aspect ratio
    const widthScale = availableWidth / imgWidth;
    const heightScale = availableHeight / imgHeight;
    const scale = Math.min(widthScale, heightScale, 1.0);

    const drawWidth = options.pageSize === 'fit' ? imgWidth : imgWidth * scale;
    const drawHeight = options.pageSize === 'fit' ? imgHeight : imgHeight * scale;

    // Center image on the page
    const drawX = margin + (availableWidth - drawWidth) / 2;
    const drawY = margin + (availableHeight - drawHeight) / 2;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }

  onProgress?.(92, 'Generating PDF binary...');
  const pdfBytes = await pdfDoc.save();

  onProgress?.(100, 'Conversion complete!');

  const firstFileName = files[0].name.replace(/\.[^/.]+$/, '');
  const outName = files.length > 1 ? `${firstFileName}-converted-all.pdf` : `${firstFileName}.pdf`;

  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  return { blob, filename: outName };
};
