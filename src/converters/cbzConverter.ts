import JSZip from 'jszip';
import type { FileItem, ConversionOptions } from '../types';
import { convertImagesToPdf } from './imageToPdf';
import { convertImageToFormat } from './imageToImage';

/**
 * Natural sort for comic book filenames (page_1, page_2, page_10)
 */
const naturalSort = (a: string, b: string): number => {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

/**
 * Extracts and sorts all comic book page images from a CBZ / ZIP file
 */
export const extractCbzPages = async (
  cbzFile: File,
  onProgress?: (percent: number, status: string) => void
): Promise<{ filename: string; pages: FileItem[]; archiveSize: number }> => {
  onProgress?.(10, 'Reading CBZ comic archive...');
  const zip = await JSZip.loadAsync(cbzFile);

  const imageRegex = /\.(jpe?g|png|webp|gif|bmp|avif)$/i;

  // Filter valid image paths, ignore metadata folders
  const imageEntries = Object.keys(zip.files).filter((path) => {
    const entry = zip.files[path];
    if (entry.dir) return false;
    if (path.includes('__MACOSX') || path.includes('.DS_Store')) return false;
    return imageRegex.test(path);
  });

  if (imageEntries.length === 0) {
    throw new Error('No readable comic pages/images found in this CBZ archive.');
  }

  // Sort pages naturally
  imageEntries.sort(naturalSort);

  const pages: FileItem[] = [];
  const total = imageEntries.length;

  for (let i = 0; i < total; i++) {
    const path = imageEntries[i];
    const entry = zip.files[path];
    const pct = Math.round(20 + (i / total) * 70);
    onProgress?.(pct, `Extracting page ${i + 1} of ${total}...`);

    const blob = await entry.async('blob');
    const cleanName = path.split('/').pop() || `page_${i + 1}.jpg`;
    const imageFile = new File([blob], cleanName, { type: blob.type || 'image/jpeg' });
    const previewUrl = URL.createObjectURL(imageFile);

    // Get image dimensions
    let width = 800;
    let height = 1200;
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        width = img.naturalWidth || 800;
        height = img.naturalHeight || 1200;
        resolve();
      };
      img.onerror = () => resolve();
      img.src = previewUrl;
    });

    pages.push({
      id: `cbz-page-${i}-${Date.now()}`,
      file: imageFile,
      name: cleanName,
      size: imageFile.size,
      type: imageFile.type,
      previewUrl,
      width,
      height,
      aspectRatio: width / height,
      pageNumber: i + 1,
      included: true,
    });
  }

  onProgress?.(100, `Successfully extracted ${total} comic pages!`);

  return {
    filename: cbzFile.name,
    pages,
    archiveSize: cbzFile.size,
  };
};

/**
 * Converts selected CBZ pages into a unified PDF document
 */
export const convertCbzToPdf = async (
  pages: FileItem[],
  comicName: string,
  options: ConversionOptions,
  onProgress?: (progress: number, statusText: string) => void
): Promise<{ blob: Blob; filename: string }> => {
  const activePages = pages.filter((p) => p.included !== false);
  if (activePages.length === 0) {
    throw new Error('No pages selected for conversion.');
  }

  const result = await convertImagesToPdf(activePages, options, onProgress);
  const baseName = comicName.replace(/\.[^/.]+$/, '');
  return {
    blob: result.blob,
    filename: `${baseName}.pdf`,
  };
};

/**
 * Extracts and converts CBZ pages into separate image files, bundled as a ZIP
 */
export const convertCbzToImagesZip = async (
  pages: FileItem[],
  comicName: string,
  format: 'jpg' | 'png' | 'webp',
  quality: number,
  compressFile: boolean,
  onProgress?: (progress: number, statusText: string) => void
): Promise<{ blob: Blob; filename: string }> => {
  const activePages = pages.filter((p) => p.included !== false);
  if (activePages.length === 0) {
    throw new Error('No pages selected for extraction.');
  }

  const outZip = new JSZip();
  const total = activePages.length;

  for (let i = 0; i < total; i++) {
    const page = activePages[i];
    const pct = Math.round((i / total) * 80);
    onProgress?.(pct, `Converting page ${i + 1} of ${total} to ${format.toUpperCase()}...`);

    let imageBlob: Blob;
    if (!compressFile && page.file.type.endsWith(format === 'jpg' ? 'jpeg' : format)) {
      imageBlob = page.file;
    } else {
      const converted = await convertImageToFormat(page, format, quality);
      imageBlob = converted.blob;
    }

    const padIndex = String(i + 1).padStart(3, '0');
    const extension = format === 'jpg' ? 'jpg' : format;
    const pageFileName = `page_${padIndex}.${extension}`;

    outZip.file(pageFileName, imageBlob);
  }

  onProgress?.(85, 'Packaging images into ZIP archive...');
  const zipBlob = await outZip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onProgress?.(85 + Math.round(metadata.percent * 0.14), `Compressing ZIP: ${Math.round(metadata.percent)}%`);
    }
  );

  onProgress?.(100, 'Extraction complete!');

  const baseName = comicName.replace(/\.[^/.]+$/, '');
  return {
    blob: zipBlob,
    filename: `${baseName}-images-${format}.zip`,
  };
};

/**
 * Creates a beautiful sample comic CBZ file in memory for instant 1-click testing
 */
export const createSampleCbzFile = async (): Promise<File> => {
  const zip = new JSZip();

  const samplePages = [
    {
      title: 'CYBERPUNK CHRONICLES',
      subtitle: 'Episode 1: Awakening',
      bgGrad: ['#0f172a', '#1e1b4b', '#4338ca'],
      badge: 'PAGE 1 / COVER',
      color: '#38bdf8',
    },
    {
      title: 'THE NEON DISTRICT',
      subtitle: 'Sector 7 - Midnight Infiltration',
      bgGrad: ['#18181b', '#312e81', '#7c3aed'],
      badge: 'PAGE 2',
      color: '#a855f7',
    },
    {
      title: 'FINAL SHOWDOWN',
      subtitle: 'Zero Hour - Data Liberation',
      bgGrad: ['#172554', '#1e3a8a', '#0284c7'],
      badge: 'PAGE 3',
      color: '#34d399',
    },
  ];

  for (let idx = 0; idx < samplePages.length; idx++) {
    const page = samplePages[idx];
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1350);
    grad.addColorStop(0, page.bgGrad[0]);
    grad.addColorStop(0.5, page.bgGrad[1]);
    grad.addColorStop(1, page.bgGrad[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 1350);

    // Comic border frame
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 840, 1290);

    // Header badge
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(page.badge, 60, 90);

    // Center comic art panels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, 130, 780, 500);
    ctx.strokeStyle = page.color;
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 130, 780, 500);

    // Panel 1 Art
    ctx.fillStyle = page.color;
    ctx.beginPath();
    ctx.arc(450, 380, 140, 0, Math.PI * 2);
    ctx.fill();

    // Dialogue speech bubble
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(100, 170, 400, 100, [16]);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('"Target locked on coordinates."', 130, 230);

    // Panel 2
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, 660, 780, 480);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 660, 780, 480);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(page.title, 90, 760);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '28px sans-serif';
    ctx.fillText(page.subtitle, 90, 820);

    // Caption box
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(90, 880, 600, 60);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('⚡ 100% Client-Side Rendered Comic Book', 110, 920);

    // Footer
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText('LocalConvert CBZ Engine · High Resolution Preview', 60, 1270);

    const blob = await new Promise<Blob>((res) => {
      canvas.toBlob((b) => res(b!), 'image/jpeg', 0.95);
    });

    const pad = String(idx + 1).padStart(3, '0');
    zip.file(`page_${pad}.jpg`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return new File([zipBlob], 'cyberpunk-chronicles-sample.cbz', {
    type: 'application/vnd.comicbook+zip',
  });
};
