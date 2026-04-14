import React from 'react';
import { 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Square, 
  BarChart3, 
  Zap, 
  FileText, 
  Presentation, 
  Share2,
  Settings,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TOOLS = [
  { id: 'presentation', name: 'Slide Deck', icon: Presentation, category: 'business' },
  { id: 'social', name: 'Social Post', icon: Share2, category: 'marketing' },
  { id: 'document', name: 'Technical Doc', icon: FileText, category: 'business' },
  { id: 'swot', name: 'SWOT Analysis', icon: BarChart3, category: 'business' },
  { id: 'logo', name: 'Brand Identity', icon: Zap, category: 'creative' },
];

interface SidebarProps {
  onToolSelect: (toolId: string) => void;
  onAddObject: (type: 'text' | 'image' | 'shape' | 'logo') => void;
  activeTool: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ onToolSelect, onAddObject, activeTool }) => {
  return (
    <div className="w-16 h-full bg-[#050505] border-r border-white/10 flex flex-col items-center py-4 gap-4">
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-4">
        <Zap className="text-black w-6 h-6" />
      </div>
      
      <TooltipProvider>
        <ScrollArea className="flex-1 w-full">
          <div className="flex flex-col items-center gap-2 px-2">
            {TOOLS.map((tool) => (
              <div key={tool.id}>
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant={activeTool === tool.id ? "secondary" : "ghost"}
                      size="icon"
                      className="w-10 h-10 rounded-xl"
                      onClick={() => onToolSelect(tool.id)}
                    >
                      <tool.icon className="w-5 h-5" />
                    </Button>
                  } />
                  <TooltipContent side="right">
                    <p>{tool.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
            
            <Separator className="my-2 bg-white/10" />
            
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-xl"
                  onClick={() => onAddObject('text')}
                >
                  <Type className="w-5 h-5" />
                </Button>
              } />
              <TooltipContent side="right"><p>Add Text</p></TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-xl"
                  onClick={() => onAddObject('image')}
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
              } />
              <TooltipContent side="right"><p>Add Image</p></TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-xl"
                  onClick={() => onAddObject('shape')}
                >
                  <Square className="w-5 h-5" />
                </Button>
              } />
              <TooltipContent side="right"><p>Add Shape</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger render={
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 rounded-xl"
                  onClick={() => onAddObject('logo')}
                >
                  <Zap className="w-5 h-5" />
                </Button>
              } />
              <TooltipContent side="right"><p>Add Logo</p></TooltipContent>
            </Tooltip>
          </div>
        </ScrollArea>
      </TooltipProvider>

      <div className="mt-auto flex flex-col gap-2">
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl opacity-50 hover:opacity-100">
          <Palette className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl opacity-50 hover:opacity-100">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
