import React from 'react';
import { AtomicObject, BrandKit } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Layers, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertiesPanelProps {
  selectedObject: AtomicObject | null;
  onUpdate: (id: string, updates: Partial<AtomicObject>) => void;
  onDelete: (id: string) => void;
  brandKit: BrandKit;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedObject, 
  onUpdate, 
  onDelete,
  brandKit 
}) => {
  if (!selectedObject) {
    return (
      <div className="w-72 h-full bg-[#050505] border-l border-white/10 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Move className="text-white/20 w-6 h-6" />
        </div>
        <h3 className="text-sm font-medium text-white/40">No Object Selected</h3>
        <p className="text-xs text-white/20 mt-2">Select an element on the canvas to edit its atomic properties.</p>
      </div>
    );
  }

  const handleStyleChange = (key: string, value: any) => {
    onUpdate(selectedObject.id, {
      style: { ...selectedObject.style, [key]: value }
    });
  };

  return (
    <div className="w-72 h-full bg-[#050505] border-l border-white/10 flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase tracking-tighter">
            {selectedObject.type}
          </Badge>
          <span className="text-[10px] font-mono text-white/30">ID: {selectedObject.id.slice(0, 4)}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 text-white/40 hover:text-white">
            <Copy className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 text-white/40 hover:text-red-400"
            onClick={() => onDelete(selectedObject.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <Separator className="bg-white/10" />
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Layout */}
          <div className="space-y-4">
            <Label className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Layout</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-white/60">Position X</Label>
                <Input 
                  type="number" 
                  value={selectedObject.x} 
                  onChange={(e) => onUpdate(selectedObject.id, { x: Number(e.target.value) })}
                  className="bg-white/5 border-white/10 h-8 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-white/60">Position Y</Label>
                <Input 
                  type="number" 
                  value={selectedObject.y} 
                  onChange={(e) => onUpdate(selectedObject.id, { y: Number(e.target.value) })}
                  className="bg-white/5 border-white/10 h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Style */}
          <div className="space-y-4">
            <Label className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Appearance</Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-white/60">Opacity</Label>
              <Slider 
                value={[selectedObject.style.opacity ?? 1]} 
                max={1} 
                step={0.01} 
                onValueChange={(vals) => handleStyleChange('opacity', vals[0])}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60">Border Radius</Label>
              <Slider 
                value={[selectedObject.style.borderRadius ?? 0]} 
                max={100} 
                step={1} 
                onValueChange={(vals) => handleStyleChange('borderRadius', vals[0])}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-white/60">Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  value={selectedObject.style.color || brandKit.primaryColor} 
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-12 h-8 p-1 bg-white/5 border-white/10"
                />
                <Input 
                  value={selectedObject.style.color || brandKit.primaryColor} 
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="flex-1 h-8 bg-white/5 border-white/10 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {selectedObject.type === 'text' && (
            <>
              <Separator className="bg-white/10" />
              <div className="space-y-4">
                <Label className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Typography</Label>
                <div className="space-y-2">
                  <Label className="text-xs text-white/60">Font Size</Label>
                  <Slider 
                    value={[selectedObject.style.fontSize ?? 16]} 
                    min={8}
                    max={120} 
                    step={1} 
                    onValueChange={(vals) => handleStyleChange('fontSize', vals[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white/60">Content</Label>
                  <textarea 
                    value={selectedObject.content?.text || ""}
                    onChange={(e) => onUpdate(selectedObject.id, { content: { ...selectedObject.content, text: e.target.value } })}
                    className="w-full bg-white/5 border-white/10 rounded-md p-2 text-xs min-h-[80px]"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
