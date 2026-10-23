import React, { useRef, useState } from 'react';
import type { FileItem } from '../../types';
import {
  Upload,
  FileText,
  X,
  Maximize2,
  Image as ImageIcon,
  Plus,
} from 'lucide-react';

interface FilePreviewCardProps {
  files: FileItem[];
  activeFileIndex: number;
  onSelectIndex: (index: number) => void;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
}

export const FilePreviewCard: React.FC<FilePreviewCardProps> = ({
  files,
  activeFileIndex,
  onSelectIndex,
  onAddFiles,
  onRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);

  const activeFile = files[activeFileIndex] || files[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="bg-white dark:bg-[#151824] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 shadow-material-sm transition-colors flex flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Card Header: Step 1 Your file */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-xs font-bold">
            1
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Your file
          </h2>
          {files.length > 1 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {files.length} images selected
            </span>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-900/50 text-xs sm:text-sm font-semibold transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Select file</span>
        </button>
      </div>

      {/* Main Preview Area */}
      {files.length === 0 ? (
        /* Empty State Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 min-h-[320px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#1a1d2c]/60 hover:bg-slate-50 dark:hover:bg-[#1a1d2c] hover:border-brand-400'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/30 text-brand-500 flex items-center justify-center mb-4 shadow-sm">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 dark:text-white mb-1">
            Choose an image to convert
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">
            Drag and drop your images here, or browse from your computer or phone.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['PNG', 'JPEG', 'JPG', 'WEBP', 'SVG', 'GIF'].map((ext) => (
              <span
                key={ext}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* Active File Preview with Figma Styling */
        <div className="flex flex-col flex-1">
          {/* Large Image Preview Container */}
          <div className="relative w-full h-[280px] sm:h-[340px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#10121c] border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center group">
            {/* Top-Left Floating Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-black/75 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200/40 dark:border-white/10 shadow-sm">
                Original preview
              </span>
            </div>

            {/* Bottom-Right Floating Fullscreen Button */}
            <button
              onClick={() => setShowFullModal(true)}
              className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-black/75 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-slate-200/40 dark:border-white/10 shadow-sm hover:scale-110 active:scale-95 transition-all"
              title="Expand preview"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Preview Image */}
            <img
              src={activeFile.previewUrl}
              alt={activeFile.name}
              className="w-full h-full object-contain p-2"
            />
          </div>

          {/* File Info Bar matching Figma */}
          <div className="mt-4 flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#191d2c] border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-500 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {activeFile.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeFile.file.type.split('/')[1]?.toUpperCase() || 'IMAGE'} ·{' '}
                  {formatFileSize(activeFile.size)}
                  {activeFile.width && activeFile.height ? ` · ${activeFile.width} × ${activeFile.height} px` : ''}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRemoveFile(activeFile.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 ml-2"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Multiple files thumbnail strip */}
          {files.length > 1 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              {files.map((file, idx) => (
                <div
                  key={file.id}
                  onClick={() => onSelectIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                    idx === activeFileIndex
                      ? 'border-brand-500 ring-2 ring-brand-500/30 scale-105'
                      : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 text-[9px] bg-black/70 text-white px-1 rounded-sm">
                    {idx + 1}
                  </span>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:border-brand-500 hover:text-brand-500 shrink-0 text-xs transition-colors"
                title="Add more images"
              >
                <Plus className="w-4 h-4 mb-0.5" />
                <span className="text-[10px]">Add</span>
              </button>
            </div>
          )}

          {/* Bottom Drop Zone matching Figma */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-4 py-2.5 px-4 rounded-xl border border-dashed text-center text-xs text-slate-500 dark:text-slate-400 cursor-pointer transition-colors ${
              isDragging
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                : 'border-slate-300/80 dark:border-slate-700/80 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-[#1a1d2c]'
            }`}
          >
            <span>Or drop a different file here · Up to 100 MB</span>
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {showFullModal && activeFile && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-[#151824] rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {activeFile.name} ({activeFile.width} × {activeFile.height} px)
              </span>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={activeFile.previewUrl}
                alt={activeFile.name}
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
