import React from 'react';
import { Link } from 'react-router-dom';
import type { ConversionTool } from '../../types';
import {
  Image as ImageIcon,
  Sparkles,
  FileImage,
  Camera,
  Minimize2,
  Layers,
  FileText,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  FileArchive,
} from 'lucide-react';

interface ToolCardProps {
  tool: ConversionTool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const renderIcon = () => {
    const props = { className: 'w-6 h-6' };
    switch (tool.iconName) {
      case 'Image':
        return <ImageIcon {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'FileImage':
        return <FileImage {...props} />;
      case 'Camera':
        return <Camera {...props} />;
      case 'Minimize2':
        return <Minimize2 {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'FileArchive':
        return <FileArchive {...props} />;
      default:
        return <ImageIcon {...props} />;
    }
  };

  return (
    <Link
      to={tool.path}
      className="group relative flex flex-col p-6 rounded-2xl bg-[#fffbf5]/90 dark:bg-[#1a1614]/90 backdrop-blur-md border border-[#edd7c2] dark:border-stone-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-warm-card transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Top Badge */}
      {tool.badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/40">
          {tool.badge}
        </span>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${tool.iconBg}`}
      >
        {renderIcon()}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-['Outfit'] font-semibold text-lg text-stone-900 dark:text-stone-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-1.5">
          {tool.title}
        </h3>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Bottom Action */}
      <div className="mt-5 pt-3 border-t border-[#f0e3d5] dark:border-stone-800/60 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
        <span>Use tool locally</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
