import React from 'react';
import { motion } from 'motion/react';
import { AtomicObject, BrandKit } from '../types';
import { cn } from '@/lib/utils';

interface CanvasProps {
  objects: AtomicObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  brandKit: BrandKit;
}

export const Canvas: React.FC<CanvasProps> = ({ objects, selectedId, onSelect, brandKit }) => {
  return (
    <div 
      className="relative w-full h-full bg-[#111] atomic-grid overflow-hidden cursor-crosshair"
      onClick={() => onSelect(null)}
    >
      {[...objects].sort((a, b) => a.zIndex - b.zIndex).map((obj) => (
        <motion.div
          key={obj.id}
          layoutId={obj.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            left: `${obj.x / 10}%`,
            top: `${obj.y / 10}%`,
            width: `${obj.width / 10}%`,
            height: `${obj.height / 10}%`,
            rotate: obj.rotation,
          }}
          className={cn(
            "absolute flex items-center justify-center overflow-hidden transition-shadow",
            selectedId === obj.id ? "ring-2 ring-white ring-offset-2 ring-offset-black z-50" : ""
          )}
          style={{
            zIndex: obj.zIndex,
            backgroundColor: obj.style.backgroundColor || 'transparent',
            color: obj.style.color || brandKit.primaryColor,
            borderRadius: obj.style.borderRadius ? `${obj.style.borderRadius}px` : '0px',
            borderWidth: obj.style.borderWidth ? `${obj.style.borderWidth}px` : '0px',
            borderColor: obj.style.borderColor || 'transparent',
            fontFamily: obj.style.fontFamily || brandKit.fontSans,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(obj.id);
          }}
        >
          {renderObjectContent(obj, brandKit)}
        </motion.div>
      ))}
    </div>
  );
};

function renderObjectContent(obj: AtomicObject, brandKit: BrandKit) {
  switch (obj.type) {
    case 'text':
      return (
        <div 
          className="w-full h-full flex items-center justify-center text-center px-4"
          style={{ fontSize: obj.style.fontSize ? `${obj.style.fontSize}px` : '16px' }}
        >
          {obj.content?.text || ""}
        </div>
      );
    case 'shape':
      if (obj.content?.shapeType === 'circle') return <div className="w-full h-full rounded-full border-inherit bg-inherit" />;
      return <div className="w-full h-full border-inherit bg-inherit" />;
    case 'image':
      return (
        <img 
          src={`https://picsum.photos/seed/${obj.content?.keyword || 'placeholder'}/${Math.round(obj.width * 2)}/${Math.round(obj.height * 2)}`}
          alt={obj.content?.keyword || 'image'}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      );
    case 'chart':
      return (
        <div className="w-full h-full flex flex-col p-4 bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2 font-mono">Real-time Data</div>
          <div className="flex-1 flex items-end gap-1">
            {obj.content?.data?.map((d: any, i: number) => (
              <div 
                key={i}
                className="flex-1 bg-current opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${d.value}%` }}
                title={`${d.label}: ${d.value}`}
              />
            ))}
          </div>
        </div>
      );
    case 'logo':
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
            <div className="w-6 h-6 rounded-sm bg-current" />
          </div>
        </div>
      );
    default:
      return null;
  }
}
