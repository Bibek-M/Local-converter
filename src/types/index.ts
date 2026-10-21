export type ToolCategory = 'all' | 'pdf' | 'image' | 'cbz' | 'security';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  pageNumber?: number;
  included?: boolean;
}

export type PageSizeOption = 'fit' | 'a4' | 'letter';
export type PageOrientationOption = 'auto' | 'portrait' | 'landscape';
export type PageMarginOption = 'none' | 'small' | 'normal';
export type TargetFormat = 'pdf' | 'webp' | 'png' | 'jpg' | 'cbz' | 'zip';

export interface ConversionOptions {
  targetFormat: TargetFormat;
  compressFile: boolean;
  quality: number; // 0 to 100
  pageSize: PageSizeOption;
  orientation: PageOrientationOption;
  margin: PageMarginOption;
  mergeAll: boolean;
}

export interface ConversionTool {
  id: string;
  title: string;
  description: string;
  badge?: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  category: ToolCategory;
  accept: string;
  targetFormat: TargetFormat;
  path: string;
  isAvailable: boolean;
}

export type CbzOutputMode = 'pdf' | 'images_zip';

export interface CbzConversionOptions extends ConversionOptions {
  outputMode: CbzOutputMode;
  imageFormat: 'jpg' | 'png' | 'webp';
}
