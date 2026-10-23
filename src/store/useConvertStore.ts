import { create } from 'zustand';
import type { ConversionOptions, FileItem, TargetFormat } from '../types';
import { convertImagesToPdf } from '../converters/imageToPdf';
import { convertImageToFormat } from '../converters/imageToImage';
import confetti from 'canvas-confetti';

interface ConvertState {
  files: FileItem[];
  activeFileIndex: number;
  options: ConversionOptions;
  isConverting: boolean;
  conversionProgress: number;
  statusMessage: string;
  resultBlob: Blob | null;
  resultFilename: string | null;
  resultUrl: string | null;
  error: string | null;

  // Actions
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setActiveFileIndex: (index: number) => void;
  setOptions: (patch: Partial<ConversionOptions>) => void;
  setTargetFormat: (format: TargetFormat) => void;
  startConversion: () => Promise<void>;
  resetResult: () => void;
  clearError: () => void;
}

const defaultOptions: ConversionOptions = {
  targetFormat: 'pdf',
  compressFile: true,
  quality: 80,
  pageSize: 'fit',
  orientation: 'auto',
  margin: 'none',
  mergeAll: true,
};

export const useConvertStore = create<ConvertState>((set, get) => ({
  files: [],
  activeFileIndex: 0,
  options: defaultOptions,
  isConverting: false,
  conversionProgress: 0,
  statusMessage: '',
  resultBlob: null,
  resultFilename: null,
  resultUrl: null,
  error: null,

  addFiles: async (newFiles: File[]) => {
    const items: FileItem[] = [];

    for (const file of newFiles) {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const previewUrl = URL.createObjectURL(file);

      // Extract image dimensions if it's an image
      let width = 0;
      let height = 0;
      if (file.type.startsWith('image/')) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            width = img.naturalWidth;
            height = img.naturalHeight;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = previewUrl;
        });
      }

      items.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        previewUrl,
        width,
        height,
        aspectRatio: width && height ? width / height : undefined,
      });
    }

    set((state) => ({
      files: [...state.files, ...items],
      activeFileIndex: state.files.length === 0 ? 0 : state.activeFileIndex,
      error: null,
    }));
  },

  removeFile: (id: string) => {
    set((state) => {
      const target = state.files.find((f) => f.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const updated = state.files.filter((f) => f.id !== id);
      return {
        files: updated,
        activeFileIndex: Math.max(0, Math.min(state.activeFileIndex, updated.length - 1)),
      };
    });
  },

  clearFiles: () => {
    const { files, resultUrl } = get();
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    set({
      files: [],
      activeFileIndex: 0,
      resultBlob: null,
      resultFilename: null,
      resultUrl: null,
      error: null,
    });
  },

  setActiveFileIndex: (index: number) => set({ activeFileIndex: index }),

  setOptions: (patch) =>
    set((state) => ({
      options: { ...state.options, ...patch },
    })),

  setTargetFormat: (format: TargetFormat) =>
    set((state) => ({
      options: { ...state.options, targetFormat: format },
    })),

  startConversion: async () => {
    const { files, options, resultUrl } = get();
    if (files.length === 0) {
      set({ error: 'Please select at least one file to convert.' });
      return;
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    set({
      isConverting: true,
      conversionProgress: 5,
      statusMessage: 'Starting local conversion...',
      error: null,
    });

    try {
      let result: { blob: Blob; filename: string };

      if (options.targetFormat === 'pdf') {
        result = await convertImagesToPdf(files, options, (progress, statusText) => {
          set({ conversionProgress: progress, statusMessage: statusText });
        });
      } else {
        // Convert to WebP, PNG, or JPG
        const format: 'webp' | 'png' | 'jpg' =
          options.targetFormat === 'png'
            ? 'png'
            : options.targetFormat === 'jpg'
            ? 'jpg'
            : 'webp';

        set({ conversionProgress: 40, statusMessage: `Converting image to ${format.toUpperCase()}...` });
        const activeFile = files[get().activeFileIndex] || files[0];
        result = await convertImageToFormat(activeFile, format, options.quality);
        set({ conversionProgress: 100, statusMessage: 'Done!' });
      }

      const url = URL.createObjectURL(result.blob);

      set({
        isConverting: false,
        conversionProgress: 100,
        resultBlob: result.blob,
        resultFilename: result.filename,
        resultUrl: url,
        statusMessage: 'Conversion completed successfully!',
      });

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#635BFF', '#A78BFA', '#10B981', '#F59E0B'],
        });
      } catch {
        // Safe fallback if confetti isn't supported
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Conversion failed. Please try again.';
      set({
        isConverting: false,
        error: message,
        statusMessage: '',
      });
    }
  },

  resetResult: () => {
    const { resultUrl } = get();
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    set({
      resultBlob: null,
      resultFilename: null,
      resultUrl: null,
      conversionProgress: 0,
      statusMessage: '',
    });
  },

  clearError: () => set({ error: null }),
}));
