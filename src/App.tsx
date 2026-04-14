/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { ChatInterface } from './components/ChatInterface';
import { PropertiesPanel } from './components/PropertiesPanel';
import { AtomicObject, BrandKit } from './types';
import { generateAtomicObjects } from './lib/gemini';
import { Button } from '@/components/ui/button';
import { Download, Share2, Palette, Zap, Layers } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const DEFAULT_BRAND_KIT: BrandKit = {
  name: "Default",
  primaryColor: "#FFFFFF",
  secondaryColor: "#A3A3A3",
  accentColor: "#3B82F6",
  fontSans: "Inter",
  fontDisplay: "Space Grotesk",
};

export default function App() {
  const [objects, setObjects] = useState<AtomicObject[]>([
    {
      id: 'welcome-text',
      type: 'text',
      x: 250,
      y: 400,
      width: 500,
      height: 100,
      rotation: 0,
      zIndex: 10,
      content: { text: 'Welcome to AtomicEngine' },
      style: {
        fontSize: 48,
        fontFamily: 'Space Grotesk',
        color: '#FFFFFF',
      }
    },
    {
      id: 'welcome-sub',
      type: 'text',
      x: 300,
      y: 500,
      width: 400,
      height: 50,
      rotation: 0,
      zIndex: 10,
      content: { text: 'Describe your vision below to start generating.' },
      style: {
        fontSize: 18,
        fontFamily: 'Inter',
        color: '#A3A3A3',
      }
    },
    {
      id: 'initial-logo',
      type: 'logo',
      x: 450,
      y: 200,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: 10,
      content: { logoType: 'default' },
      style: {
        color: '#FFFFFF',
      }
    }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KIT);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const newObjects = await generateAtomicObjects(prompt, brandKit);
      setObjects(newObjects);
      setSelectedId(null);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddObject = (type: 'text' | 'image' | 'shape' | 'logo') => {
    const id = `${type}-${Date.now()}`;
    const newObj: AtomicObject = {
      id,
      type,
      x: 400,
      y: 400,
      width: type === 'text' ? 400 : 200,
      height: type === 'text' ? 100 : 200,
      rotation: 0,
      zIndex: objects.length + 1,
      content: type === 'text' ? { text: 'New Text' } : 
               type === 'image' ? { keyword: 'nature' } :
               type === 'shape' ? { shapeType: 'rect' } :
               { logoType: 'default' },
      style: {
        color: brandKit.primaryColor,
        fontSize: 24,
      }
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedId(id);
  };

  const updateObject = (id: string, updates: Partial<AtomicObject>) => {
    setObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
  };

  const deleteObject = (id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const selectedObject = objects.find(obj => obj.id === selectedId) || null;

  return (
    <div className="flex h-screen w-full bg-[#0A0A0A] overflow-hidden">
      {/* Sidebar - Tool Selection */}
      <Sidebar 
        activeTool={activeTool} 
        onToolSelect={(id) => setActiveTool(id)} 
        onAddObject={handleAddObject}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-white" />
              <h1 className="font-display font-bold text-sm tracking-tight">ATOMIC ENGINE</h1>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <Layers className="w-3 h-3" />
              <span>{objects.length} OBJECTS</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-xs gap-2">
                  <Palette className="w-3 h-3" />
                  <span>Brand Kit: {brandKit.name}</span>
                </Button>
              } />
              <DropdownMenuContent align="end" className="bg-[#111] border-white/10 text-white">
                <DropdownMenuItem onClick={() => setBrandKit(DEFAULT_BRAND_KIT)}>Default</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBrandKit({ ...DEFAULT_BRAND_KIT, name: "Neon", primaryColor: "#00FF00", accentColor: "#FF00FF" })}>Neon Cyber</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBrandKit({ ...DEFAULT_BRAND_KIT, name: "Minimal", primaryColor: "#000000", backgroundColor: "#FFFFFF" } as any)}>Minimalist</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-xs gap-2">
              <Share2 className="w-3 h-3" />
              <span>Share</span>
            </Button>
            
            <Button size="sm" className="bg-white text-black hover:bg-white/90 text-xs gap-2 font-medium">
              <Download className="w-3 h-3" />
              <span>Export</span>
            </Button>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 flex min-h-0">
          <div className="flex-1 relative">
            <Canvas 
              objects={objects} 
              selectedId={selectedId} 
              onSelect={setSelectedId}
              brandKit={brandKit}
            />
          </div>
          
          {/* Properties Panel */}
          <PropertiesPanel 
            selectedObject={selectedObject} 
            onUpdate={updateObject}
            onDelete={deleteObject}
            brandKit={brandKit}
          />
        </main>

        {/* AI Chat Interface */}
        <ChatInterface 
          onGenerate={handleGenerate} 
          isGenerating={isGenerating} 
        />
      </div>
    </div>
  );
}

